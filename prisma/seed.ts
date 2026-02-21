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
    { name: 'Trailer Truck', model: 'Volvo VNL',          licensePlate: 'MH-12-AB-1234', maxLoadCapacity: 20000, status: VehicleStatus.AVAILABLE, odometer: 15400 },
    { name: 'Van',           model: 'Ford Transit',        licensePlate: 'MH-14-XY-9876', maxLoadCapacity: 1000,  status: VehicleStatus.AVAILABLE, odometer: 3200  },
    { name: 'Bike',          model: 'Honda Activa',        licensePlate: 'MH-09-PQ-4567', maxLoadCapacity: 50,    status: VehicleStatus.AVAILABLE, odometer: 1250  },
    { name: 'Trailer Truck', model: 'Scania R500',         licensePlate: 'MH-12-CD-5678', maxLoadCapacity: 20000, status: VehicleStatus.ON_TRIP,   odometer: 42000 },
    { name: 'Box Truck',     model: 'Isuzu NQR',           licensePlate: 'MH-02-ZZ-1111', maxLoadCapacity: 5000,  status: VehicleStatus.IN_SHOP,   odometer: 78000 },
    { name: 'Van',           model: 'Mercedes Sprinter',   licensePlate: 'MH-01-AA-4444', maxLoadCapacity: 1500,  status: VehicleStatus.AVAILABLE, odometer: 150   },
    { name: 'Bike',          model: 'TVS XL100',           licensePlate: 'MH-43-BB-9999', maxLoadCapacity: 60,    status: VehicleStatus.AVAILABLE, odometer: 800   },
  ]

  const createdVehicles = []
  for (const v of vehicles) {
    createdVehicles.push(await prisma.vehicle.create({ data: v }))
  }

  console.log('Seeding Drivers...')
  const today   = new Date('2024-12-01') // Treat today as Dec 2024 for seeding
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

  console.log('Seeding 12 Months of Historical Analytics Data...')
  
  // Create trips and expenses spanning Jan -> Dec 2024
  for (let month = 0; month < 12; month++) { // 0 = Jan, 11 = Dec
    
    // Each month, let's randomly create 3-6 trips
    const numTrips = Math.floor(Math.random() * 4) + 3;
    
    for (let t = 0; t < numTrips; t++) {
        // Random assignees
        const v = createdVehicles[Math.floor(Math.random() * createdVehicles.length)]
        const d = createdDrivers[Math.floor(Math.random() * createdDrivers.length)]
        
        // Random date in that month
        const tripDate = new Date(2024, month, Math.floor(Math.random() * 28) + 1)
        
        // Random cargo (bound by vehicle max capacity safely)
        const cargo = Math.floor(Math.random() * (v.maxLoadCapacity * 0.8)) + (v.maxLoadCapacity * 0.1)

        // Random fuel cost and liters
        const fuelCost = Math.floor(Math.random() * 3000) + 500
        const liters = Math.floor(fuelCost / 100)

        // Add the trip
        await prisma.trip.create({
            data: {
                origin: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
                destination: ['Nashik', 'Noida', 'Chennai', 'Surat', 'Vijayawada'][Math.floor(Math.random() * 5)],
                cargoWeight: cargo,
                status: month === 11 && t === 0 ? TripStatus.DISPATCHED : TripStatus.COMPLETED,
                vehicleId: v.id,
                driverId: d.id,
                finalOdometer: v.odometer + Math.floor(Math.random() * 500) + 100,
                createdAt: tripDate,
            }
        });

        // Add the corresponding fuel expense
        await prisma.expense.create({
            data: {
                vehicleId: v.id,
                cost: fuelCost,
                liters: liters,
                type: 'FUEL',
                date: tripDate,
            }
        });

        // Random 15% chance of maintenance in a month
        if (Math.random() > 0.85) {
            const maintCost = Math.floor(Math.random() * 8000) + 2000;
            const issueArr = ['Engine Check', 'Brake Pad Replacement', 'Oil Change', 'Tyre Replacement'];
            await prisma.maintenanceLog.create({
                data: {
                    vehicleId: v.id,
                    serviceType: issueArr[Math.floor(Math.random() * issueArr.length)],
                    cost: maintCost,
                    date: tripDate,
                }
            });
            await prisma.expense.create({
                data: {
                    vehicleId: v.id,
                    cost: maintCost,
                    type: 'MAINTENANCE',
                    date: tripDate,
                }
            });
        }
    }
  }

  console.log('✅ Analytical Seeding Complete! Jan-Dec 2024 data inserted.')
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
