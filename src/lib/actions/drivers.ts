"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DriverStatus } from "@prisma/client";

export type DriverFormData = {
    name: string;
    licenseNumber: string;
    licenseExpiry: string; 
    category: string;
};

// Helper for database operations with retry logic for Neon cold starts
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error: any) {
            lastError = error;
            const isTimeout =
                error.message?.includes("connection pool") ||
                error.message?.includes("Can't reach database") ||
                error.message?.includes("Timed out") ||
                error.code === 'P1001'; // Can't reach database server

            if (isTimeout && i < maxRetries - 1) {
                console.log(`Database connection failed, retrying... (${i + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

export async function getDrivers() {
    return withRetry(async () => {
        // Fetch all drivers with their trips to calculate completion rates implicitly
        const drivers = await prisma.driver.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                trips: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
        });

        return drivers.map((driver: any) => {
            const totalTrips = driver.trips.length;
            const completedTrips = driver.trips.filter((t: any) => t.status === "COMPLETED").length;
            const completionRate = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 100;

            return {
                ...driver,
                completionRate,
            };
        });
    });
}

export async function createDriver(data: DriverFormData) {
    return withRetry(async () => {
        const existing = await prisma.driver.findUnique({
            where: { licenseNumber: data.licenseNumber },
        });
        if (existing) throw new Error("A driver with this license number already exists.");

        const driver = await prisma.driver.create({
            data: {
                name: data.name,
                licenseNumber: data.licenseNumber.toUpperCase(),
                licenseExpiry: new Date(data.licenseExpiry),
                category: data.category,
                status: "OFF_DUTY" as any,
                safetyScore: 100,
            },
        });
        revalidatePath("/performance");
        revalidatePath("/dashboard");
        return driver;
    });
}

export async function updateDriverStatus(id: string, targetStatus: DriverStatus) {
    return withRetry(async () => {
        const driver = await prisma.driver.update({
            where: { id },
            data: { status: targetStatus as any },
        });
        revalidatePath("/performance");
        revalidatePath("/dashboard");
        return driver;
    });
}

export async function deleteDriver(id: string) {
    return withRetry(async () => {
        const active = await prisma.trip.count({
            where: { driverId: id, status: { in: ["DISPATCHED", "DRAFT"] } },
        });

        if (active > 0) {
            throw new Error("Cannot delete a driver with active, drafted, or pending trips.");
        }

        try {
            await prisma.driver.delete({ where: { id } });
        } catch (error: any) {
            // P2003 is the Prisma error code for foreign key constraint violation
            if (error.code === 'P2003') {
                throw new Error("This driver has historical trip records and cannot be permanently deleted. Try suspending them instead to maintain data integrity.");
            }
            throw error;
        }

        revalidatePath("/performance");
        revalidatePath("/dashboard");
    });
}

export async function seedDrivers() {
    return withRetry(async () => {
        const count = await prisma.driver.count();
        if (count > 0) return { seeded: false, message: "Database already has drivers." };

        const future1 = new Date(); future1.setFullYear(future1.getFullYear() + 2);
        const future2 = new Date(); future2.setFullYear(future2.getFullYear() + 1);
        const future3 = new Date(); future3.setFullYear(future3.getFullYear() + 3);
        const pastExpired = new Date(); pastExpired.setFullYear(pastExpired.getFullYear() - 1);

        const mockDrivers = [
            { name: "John Doe", licenseNumber: "DL-23223", licenseExpiry: future1, category: "Truck", status: "ON_DUTY" as any, safetyScore: 89 },
            { name: "Alice Smith", licenseNumber: "DL-19943", licenseExpiry: future2, category: "Van", status: "OFF_DUTY" as any, safetyScore: 98 },
            { name: "Bob Johnson", licenseNumber: "DL-88432", licenseExpiry: pastExpired, category: "Truck", status: "SUSPENDED" as any, safetyScore: 65 },
            { name: "Charlie Davis", licenseNumber: "DL-65321", licenseExpiry: future3, category: "Mini", status: "ON_DUTY" as any, safetyScore: 92 },
            { name: "Eve Miller", licenseNumber: "DL-40291", licenseExpiry: future1, category: "Bike", status: "OFF_DUTY" as any, safetyScore: 100 },
            { name: "Frank Wilson", licenseNumber: "DL-11847", licenseExpiry: future2, category: "Truck", status: "OFF_DUTY" as any, safetyScore: 81 },
        ];

        await prisma.driver.createMany({ data: mockDrivers });
        revalidatePath("/performance");
        revalidatePath("/dashboard");
        return { seeded: true, count: mockDrivers.length };
    });
}
