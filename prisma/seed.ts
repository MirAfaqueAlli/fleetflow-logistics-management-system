import { PrismaClient, VehicleStatus, DriverStatus, TripStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing old data...')
  await prisma.expense.deleteMany()
  await prisma.maintenanceLog.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()

  console.log('Seeding Vehicles...')
  const vehicles = [
    { name: 'Trailer Truck-01', model: 'Volvo VNL', licensePlate: 'MH-12-AB-1234', maxLoadCapacity: 20000, status: VehicleStatus.AVAILABLE, odometer: 15400 },
    { name: 'Van-05', model: 'Ford Transit', licensePlate: 'MH-14-XY-9876', maxLoadCapacity: 1000, status: VehicleStatus.AVAILABLE, odometer: 3200 },
    { name: 'Bike-02', model: 'Honda Activa', licensePlate: 'MH-09-PQ-4567', maxLoadCapacity: 50, status: VehicleStatus.AVAILABLE, odometer: 1250 },
    { name: 'Trailer Truck-02', model: 'Scania R500', licensePlate: 'MH-12-CD-5678', maxLoadCapacity: 20000, status: VehicleStatus.ON_TRIP, odometer: 42000 },
    { name: 'Box Truck-03', model: 'Isuzu NQR', licensePlate: 'MH-02-ZZ-1111', maxLoadCapacity: 5000, status: VehicleStatus.IN_SHOP, odometer: 78000 },
    { name: 'Van-08', model: 'Mercedes Sprinter', licensePlate: 'MH-01-AA-4444', maxLoadCapacity: 1500, status: VehicleStatus.AVAILABLE, odometer: 150 },
    { name: 'Bike-05', model: 'TVS XL100', licensePlate: 'MH-43-BB-9999', maxLoadCapacity: 60, status: VehicleStatus.AVAILABLE, odometer: 800 },
  ]

  const createdVehicles = []
  for (const v of vehicles as any[]) {
    createdVehicles.push(await prisma.vehicle.create({ data: v }))
  }

  console.log('Seeding Drivers...')
  const today = new Date()
  const nextYear = new Date(today.setFullYear(today.getFullYear() + 1))
  const pastYear = new Date(today.setFullYear(today.getFullYear() - 2)) // expired

  const drivers = [
    { name: 'Rajesh Kumar', licenseNumber: 'DL-11111', licenseExpiry: nextYear, category: 'Trailer Truck', status: DriverStatus.OFF_DUTY },
    { name: 'Amit Singh', licenseNumber: 'DL-22222', licenseExpiry: nextYear, category: 'Van', status: DriverStatus.OFF_DUTY },
    { name: 'Suresh Patel', licenseNumber: 'DL-33333', licenseExpiry: nextYear, category: 'Trailer Truck', status: DriverStatus.ON_DUTY },
    { name: 'Vikram Sharma', licenseNumber: 'DL-44444', licenseExpiry: nextYear, category: 'Bike', status: DriverStatus.OFF_DUTY },
    { name: 'Arjun Verma', licenseNumber: 'DL-55555', licenseExpiry: pastYear, category: 'Box Truck', status: DriverStatus.SUSPENDED }, // Expired license
    { name: 'Ravi Teja', licenseNumber: 'DL-66666', licenseExpiry: nextYear, category: 'Van', status: DriverStatus.OFF_DUTY },
  ]

  const createdDrivers = []
  for (const d of drivers as any[]) {
    createdDrivers.push(await prisma.driver.create({ data: d }))
  }

  console.log('Seeding Trips...')
  const trips = [
    {
      origin: 'Mumbai',
      destination: 'Pune',
      cargoWeight: 15000,
      status: TripStatus.DISPATCHED,
      vehicleId: createdVehicles[3].id, // Trailer Truck-02 (ON_TRIP)
      driverId: createdDrivers[2].id, // Suresh Patel (ON_DUTY)
    },
    {
      origin: 'Delhi',
      destination: 'Noida',
      cargoWeight: 800,
      status: TripStatus.COMPLETED,
      vehicleId: createdVehicles[1].id, // Van-05
      driverId: createdDrivers[1].id, // Amit Singh
      finalOdometer: 3200
    }
  ]

  for (const t of trips as any[]) {
    await prisma.trip.create({ data: t })
  }

  console.log('Seeding Database Completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
