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
    { name: 'Trailer Truck-01', model: 'Volvo VNL',          licensePlate: 'MH-12-AB-1234', maxLoadCapacity: 20000, status: VehicleStatus.AVAILABLE, odometer: 15400 },
    { name: 'Van-05',           model: 'Ford Transit',        licensePlate: 'MH-14-XY-9876', maxLoadCapacity: 1000,  status: VehicleStatus.AVAILABLE, odometer: 3200  },
    { name: 'Bike-02',          model: 'Honda Activa',        licensePlate: 'MH-09-PQ-4567', maxLoadCapacity: 50,    status: VehicleStatus.AVAILABLE, odometer: 1250  },
    { name: 'Trailer Truck-02', model: 'Scania R500',         licensePlate: 'MH-12-CD-5678', maxLoadCapacity: 20000, status: VehicleStatus.ON_TRIP,   odometer: 42000 },
    { name: 'Box Truck-03',     model: 'Isuzu NQR',           licensePlate: 'MH-02-ZZ-1111', maxLoadCapacity: 5000,  status: VehicleStatus.IN_SHOP,   odometer: 78000 },
    { name: 'Van-08',           model: 'Mercedes Sprinter',   licensePlate: 'MH-01-AA-4444', maxLoadCapacity: 1500,  status: VehicleStatus.AVAILABLE, odometer: 150   },
    { name: 'Bike-05',          model: 'TVS XL100',           licensePlate: 'MH-43-BB-9999', maxLoadCapacity: 60,    status: VehicleStatus.AVAILABLE, odometer: 800   },
  ]

  const createdVehicles = []
  for (const v of vehicles) {
    createdVehicles.push(await prisma.vehicle.create({ data: v }))
  }

  // Vehicle shortcuts for readability
  const [truck01, van05, bike02, truck02, boxTruck03, van08, bike05] = createdVehicles

  console.log('Seeding Drivers...')
  const today   = new Date()
  const nextYear = new Date(today); nextYear.setFullYear(today.getFullYear() + 1)
  const pastYear = new Date(today); pastYear.setFullYear(today.getFullYear() - 2)

  const drivers = [
    { name: 'Rajesh Kumar',  licenseNumber: 'DL-11111', licenseExpiry: nextYear, category: 'Trailer Truck', status: DriverStatus.OFF_DUTY   },
    { name: 'Amit Singh',    licenseNumber: 'DL-22222', licenseExpiry: nextYear, category: 'Van',           status: DriverStatus.OFF_DUTY   },
    { name: 'Suresh Patel',  licenseNumber: 'DL-33333', licenseExpiry: nextYear, category: 'Trailer Truck', status: DriverStatus.ON_DUTY    },
    { name: 'Vikram Sharma', licenseNumber: 'DL-44444', licenseExpiry: nextYear, category: 'Bike',          status: DriverStatus.OFF_DUTY   },
    { name: 'Arjun Verma',   licenseNumber: 'DL-55555', licenseExpiry: pastYear, category: 'Box Truck',     status: DriverStatus.SUSPENDED  },
    { name: 'Ravi Teja',     licenseNumber: 'DL-66666', licenseExpiry: nextYear, category: 'Van',           status: DriverStatus.OFF_DUTY   },
  ]

  const createdDrivers = []
  for (const d of drivers) {
    createdDrivers.push(await prisma.driver.create({ data: d }))
  }

  console.log('Seeding Trips...')
  const trips = [
    {
      origin: 'Mumbai', destination: 'Pune',
      cargoWeight: 15000, status: TripStatus.DISPATCHED,
      vehicleId: truck02.id,
      driverId: createdDrivers[2].id, // Suresh Patel (ON_DUTY)
    },
    {
      origin: 'Delhi', destination: 'Noida',
      cargoWeight: 800, status: TripStatus.COMPLETED,
      vehicleId: van05.id,
      driverId: createdDrivers[1].id, // Amit Singh
      finalOdometer: 3400,
    },
    {
      origin: 'Bangalore', destination: 'Chennai',
      cargoWeight: 1200, status: TripStatus.COMPLETED,
      vehicleId: bike02.id,
      driverId: createdDrivers[3].id, // Vikram Sharma
      finalOdometer: 1380,
    },
    {
      origin: 'Hyderabad', destination: 'Vijayawada',
      cargoWeight: 900, status: TripStatus.COMPLETED,
      vehicleId: van08.id,
      driverId: createdDrivers[5].id, // Ravi Teja
      finalOdometer: 280,
    },
    {
      origin: 'Pune', destination: 'Nashik',
      cargoWeight: 45,  status: TripStatus.COMPLETED,
      vehicleId: bike05.id,
      driverId: createdDrivers[0].id, // Rajesh Kumar
      finalOdometer: 870,
    },
  ]

  const createdTrips = []
  for (const t of trips) {
    createdTrips.push(await prisma.trip.create({ data: t }))
  }

  console.log('Seeding Maintenance Logs...')
  const maintenanceLogs = [
    {
      vehicleId: boxTruck03.id,
      serviceType: 'Engine Issue',
      cost: 10000,
      date: new Date('2024-02-20'),
    },
    {
      vehicleId: van05.id,
      serviceType: 'Oil Change',
      cost: 1500,
      date: new Date('2024-02-15'),
    },
    {
      vehicleId: truck01.id,
      serviceType: 'Brake Pad Replacement',
      cost: 5000,
      date: new Date('2024-02-10'),
    },
  ]

  for (const m of maintenanceLogs) {
    await prisma.maintenanceLog.create({ data: m })
  }

  console.log('Seeding Fuel Expenses...')
  const fuelExpenses = [
    { vehicleId: van05.id,    cost: 1000, liters: 83,  type: 'FUEL', date: new Date('2024-02-21') },
    { vehicleId: truck02.id,  cost: 750,  liters: 62,  type: 'FUEL', date: new Date('2024-02-20') },
    { vehicleId: bike02.id,   cost: 1800, liters: 150, type: 'FUEL', date: new Date('2024-02-19') },
    { vehicleId: van08.id,    cost: 1150, liters: 96,  type: 'FUEL', date: new Date('2024-02-18') },
    { vehicleId: bike05.id,   cost: 400,  liters: 33,  type: 'FUEL', date: new Date('2024-02-17') },
  ]

  for (const e of fuelExpenses) {
    await prisma.expense.create({ data: e })
  }

  console.log('✅ Seeding Complete!')
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
