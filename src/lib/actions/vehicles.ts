"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { VehicleStatus } from "@prisma/client";

export type VehicleFormData = {
    name: string;
    model: string;
    licensePlate: string;
    maxLoadCapacity: number;
    odometer: number;
};

export async function getVehicles() {
    return await prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { trips: true, expenses: true, maintenanceLogs: true } },
        },
    });
}

export async function createVehicle(data: VehicleFormData) {
    const existing = await prisma.vehicle.findUnique({
        where: { licensePlate: data.licensePlate },
    });
    if (existing) throw new Error("A vehicle with this license plate already exists.");

    const vehicle = await prisma.vehicle.create({
        data: {
            name: data.name,
            model: data.model,
            licensePlate: data.licensePlate.toUpperCase(),
            maxLoadCapacity: Number(data.maxLoadCapacity),
            odometer: Number(data.odometer),
            status: "AVAILABLE" as any,
        },
    });
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return vehicle;
}

export async function updateVehicle(id: string, data: Partial<VehicleFormData>) {
    const vehicle = await prisma.vehicle.update({
        where: { id },
        data: {
            name: data.name,
            model: data.model,
            licensePlate: data.licensePlate?.toUpperCase(),
            maxLoadCapacity: data.maxLoadCapacity !== undefined ? Number(data.maxLoadCapacity) : undefined,
            odometer: data.odometer !== undefined ? Number(data.odometer) : undefined,
        },
    });
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return vehicle;
}

export async function toggleVehicleRetired(id: string, currentStatus: VehicleStatus) {
    const newStatus =
        currentStatus === VehicleStatus.RETIRED
            ? VehicleStatus.AVAILABLE
            : VehicleStatus.RETIRED;

    const vehicle = await prisma.vehicle.update({
        where: { id },
        data: { status: newStatus as any },
    });
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return vehicle;
}

export async function deleteVehicle(id: string) {
    // Check for active or pending trips
    const active = await prisma.trip.count({
        where: { vehicleId: id, status: { in: ["DISPATCHED", "DRAFT"] } },
    });

    if (active > 0) {
        throw new Error("Cannot delete a vehicle with active, drafted, or pending trips.");
    }

    try {
        await prisma.vehicle.delete({ where: { id } });
    } catch (error: any) {
        // P2003 is the Prisma error code for foreign key constraint violation
        if (error.code === 'P2003') {
            throw new Error("This vehicle has historical trip records and cannot be permanently deleted. Try setting it to 'Retired' instead to maintain data integrity.");
        }
        throw error;
    }

    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
}

export async function seedVehicles() {
    const count = await prisma.vehicle.count();
    if (count > 0) return { seeded: false, message: "Database already has vehicles." };

    const mockVehicles = [
        { name: "Titan Hauler", model: "Truck", licensePlate: "TH-001", maxLoadCapacity: 15000, odometer: 84320, status: VehicleStatus.AVAILABLE },
        { name: "Speedster Van", model: "Van", licensePlate: "SV-002", maxLoadCapacity: 1200, odometer: 32100, status: VehicleStatus.ON_TRIP },
        { name: "Mini Courier", model: "Mini", licensePlate: "MC-003", maxLoadCapacity: 500, odometer: 12500, status: VehicleStatus.AVAILABLE },
        { name: "Atlas Prime", model: "Truck", licensePlate: "AP-004", maxLoadCapacity: 20000, odometer: 121000, status: VehicleStatus.IN_SHOP },
        { name: "Rapid Van", model: "Van", licensePlate: "RV-005", maxLoadCapacity: 1500, odometer: 47800, status: VehicleStatus.AVAILABLE },
        { name: "Iron Steed", model: "Truck", licensePlate: "IS-006", maxLoadCapacity: 18000, odometer: 96400, status: VehicleStatus.AVAILABLE },
        { name: "City Shuttle", model: "Mini", licensePlate: "CS-007", maxLoadCapacity: 600, odometer: 8900, status: VehicleStatus.RETIRED },
        { name: "Cargo King", model: "Truck", licensePlate: "CK-008", maxLoadCapacity: 22000, odometer: 210000, status: VehicleStatus.AVAILABLE },
    ];

    await prisma.vehicle.createMany({ data: mockVehicles });
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { seeded: true, count: mockVehicles.length };
}
