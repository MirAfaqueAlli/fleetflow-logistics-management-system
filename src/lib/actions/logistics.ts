"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { VehicleStatus, DriverStatus, TripStatus } from "@prisma/client";

// --- Vehicles ---
export async function getVehicles() {
  return await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAvailableVehicles() {
  return await prisma.vehicle.findMany({
    where: { status: VehicleStatus.AVAILABLE },
    orderBy: { createdAt: "desc" },
  });
}

export async function createVehicle(data: any) {
  const vehicle = await prisma.vehicle.create({
    data,
  });
  revalidatePath("/vehicles");
  revalidatePath("/");
  return vehicle;
}

// --- Drivers ---
export async function getDrivers() {
  return await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAvailableDrivers() {
  return await prisma.driver.findMany({
    where: { status: DriverStatus.OFF_DUTY },
    orderBy: { createdAt: "desc" },
  });
}

export async function createDriver(data: any) {
  const driver = await prisma.driver.create({
    data: {
      ...data,
      licenseExpiry: new Date(data.licenseExpiry),
    },
  });
  revalidatePath("/drivers");
  return driver;
}

// --- Trips ---
export async function getTrips() {
  return await prisma.trip.findMany({
    include: {
      vehicle: true,
      driver: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTrip(data: any) {
  // 1. Validation Logic: Prevent trip if CargoWeight > MaxCapacity
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: data.vehicleId },
  });

  if (!vehicle) throw new Error("Vehicle not found");
  if (data.cargoWeight > vehicle.maxLoadCapacity) {
    throw new Error("Cargo weight exceeds vehicle capacity!");
  }

  // 2. Validation Logic: Block if license expired
  const driver = await prisma.driver.findUnique({
    where: { id: data.driverId },
  });

  if (!driver) throw new Error("Driver not found");
  if (new Date(driver.licenseExpiry) < new Date()) {
    throw new Error("Driver license has expired! Assignment blocked.");
  }

  const trip = await prisma.trip.create({
    data: {
      ...data,
      status: TripStatus.DISPATCHED,
    },
  });

  // 3. Status Update: Vehicle & Driver -> ON_TRIP
  await prisma.vehicle.update({
    where: { id: data.vehicleId },
    data: { status: VehicleStatus.ON_TRIP },
  });

  await prisma.driver.update({
    where: { id: data.driverId },
    data: { status: DriverStatus.ON_DUTY },
  });

  revalidatePath("/dispatch");
  revalidatePath("/");
  return trip;
}

export async function completeTrip(tripId: string, finalOdometer: number) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
  });

  if (!trip) throw new Error("Trip not found");

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      status: TripStatus.COMPLETED,
      finalOdometer,
    },
  });

  // Status Update: Vehicle & Driver -> AVAILABLE / OFF_DUTY
  await prisma.vehicle.update({
    where: { id: trip.vehicleId },
    data: { 
      status: VehicleStatus.AVAILABLE,
      odometer: finalOdometer
    },
  });

  await prisma.driver.update({
    where: { id: trip.driverId },
    data: { status: DriverStatus.OFF_DUTY },
  });

  revalidatePath("/dispatch");
  revalidatePath("/");
}

// --- Maintenance ---
export async function logMaintenance(data: any) {
  const log = await prisma.maintenanceLog.create({
    data,
  });

  // Logic: Adding vehicle to Service Log switches status to IN_SHOP
  await prisma.vehicle.update({
    where: { id: data.vehicleId },
    data: { status: VehicleStatus.IN_SHOP },
  });

  // Also log as an expense
  await prisma.expense.create({
    data: {
      vehicleId: data.vehicleId,
      cost: data.cost,
      type: "MAINTENANCE",
    }
  });

  revalidatePath("/maintenance");
  revalidatePath("/vehicles");
  revalidatePath("/");
  return log;
}

// --- Expenses ---
export async function getExpenses() {
  return await prisma.expense.findMany({
    include: { vehicle: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function logExpense(data: any) {
  const expense = await prisma.expense.create({
    data,
  });
  revalidatePath("/expenses");
  revalidatePath("/analytics");
  return expense;
}
