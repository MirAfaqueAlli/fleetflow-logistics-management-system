"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { DriverStatus } from "@prisma/client";

export type DriverFormData = {
    name: string;
    licenseNumber: string;
    licenseExpiry: string; // ISO date string from form
    category: string;
};

export async function getDrivers() {
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

    return drivers.map(driver => {
        const totalTrips = driver.trips.length;
        const completedTrips = driver.trips.filter(t => t.status === "COMPLETED").length;
        const completionRate = totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 100;

        return {
            ...driver,
            completionRate,
        };
    });
}

export async function createDriver(data: DriverFormData) {
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
            status: DriverStatus.OFF_DUTY,
            safetyScore: 100,
            complaints: 0,
        },
    });
    revalidatePath("/performance");
    revalidatePath("/dashboard");
    return driver;
}

export async function updateDriverStatus(id: string, targetStatus: DriverStatus) {
    const driver = await prisma.driver.update({
        where: { id },
        data: { status: targetStatus },
    });
    revalidatePath("/performance");
    revalidatePath("/dashboard");
    return driver;
}

export async function deleteDriver(id: string) {
    const active = await prisma.trip.count({
        where: { driverId: id, status: { in: ["DISPATCHED"] } },
    });
    if (active > 0) throw new Error("Cannot delete a driver with active trips.");

    await prisma.driver.delete({ where: { id } });
    revalidatePath("/performance");
    revalidatePath("/dashboard");
}

export async function seedDrivers() {
    const count = await prisma.driver.count();
    if (count > 0) return { seeded: false, message: "Database already has drivers." };

    const future1 = new Date(); future1.setFullYear(future1.getFullYear() + 2);
    const future2 = new Date(); future2.setFullYear(future2.getFullYear() + 1);
    const future3 = new Date(); future3.setFullYear(future3.getFullYear() + 3);
    const pastExpired = new Date(); pastExpired.setFullYear(pastExpired.getFullYear() - 1);

    const mockDrivers = [
        { name: "John Doe", licenseNumber: "DL-23223", licenseExpiry: future1, category: "Truck", status: DriverStatus.ON_DUTY, safetyScore: 89, complaints: 4 },
        { name: "Alice Smith", licenseNumber: "DL-19943", licenseExpiry: future2, category: "Van", status: DriverStatus.OFF_DUTY, safetyScore: 98, complaints: 0 },
        { name: "Bob Johnson", licenseNumber: "DL-88432", licenseExpiry: pastExpired, category: "Truck", status: DriverStatus.SUSPENDED, safetyScore: 65, complaints: 8 },
        { name: "Charlie Davis", licenseNumber: "DL-65321", licenseExpiry: future3, category: "Mini", status: DriverStatus.ON_DUTY, safetyScore: 92, complaints: 1 },
        { name: "Eve Miller", licenseNumber: "DL-40291", licenseExpiry: future1, category: "Bike", status: DriverStatus.OFF_DUTY, safetyScore: 100, complaints: 0 },
        { name: "Frank Wilson", licenseNumber: "DL-11847", licenseExpiry: future2, category: "Truck", status: DriverStatus.OFF_DUTY, safetyScore: 81, complaints: 3 },
    ];

    await prisma.driver.createMany({ data: mockDrivers });
    revalidatePath("/performance");
    revalidatePath("/dashboard");
    return { seeded: true, count: mockDrivers.length };
}
