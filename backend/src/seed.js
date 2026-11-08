import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./config/db.js";

export const seedData = async (shouldDisconnect = false) => {
  try {
    console.log("Starting database seeding for Om Enterprises...");

    // 1. Seed Administrator
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.admin.create({
        data: {
          adminName: "Administrator",
          email: adminEmail,
          password: hashedAdminPassword,
        },
      });
      console.log(`✓ Admin created: ${adminEmail} (Password: ${adminPassword})`);
    } else {
      console.log(`✓ Admin already exists: ${adminEmail}`);
    }

    // 2. Seed Standard Pest Control Services
    const defaultServices = [
      {
        serviceName: "General Pest Control",
        description: "Comprehensive odorless spray and gel treatment for cockroaches, ants, spiders, and common household insects.",
        price: 1499,
        validity: 90,
      },
      {
        serviceName: "Anti-Termite Treatment",
        description: "Specialized drill-fill-seal subterranean termite treatment protecting doors, wooden fittings, and foundations.",
        price: 3999,
        validity: 365,
      },
      {
        serviceName: "Bed Bug Eradication",
        description: "Two-stage heat and chemical steaming treatment targeting bed bug eggs, nymphs, and adult pests in mattresses and furniture.",
        price: 2499,
        validity: 90,
      },
      {
        serviceName: "Cockroach Gel Treatment",
        description: "Targeted dot technology with advanced Bayer gel formula for modular kitchens and pantry areas without clearing utensils.",
        price: 1199,
        validity: 60,
      },
      {
        serviceName: "Rodent & Rat Management",
        description: "Strategic baiting stations, glue pads, and burrow fumigation designed to prevent food contamination and wire damage.",
        price: 1899,
        validity: 60,
      },
      {
        serviceName: "Mosquito & Fly Fogging",
        description: "Cold thermal fogging treatment for garden areas, society compounds, and open drains to eliminate breeding grounds.",
        price: 1299,
        validity: 30,
      },
    ];

    for (const service of defaultServices) {
      const existing = await prisma.service.findUnique({
        where: { serviceName: service.serviceName },
      });

      if (!existing) {
        await prisma.service.create({
          data: {
            serviceName: service.serviceName,
            description: service.description,
            price: service.price,
            validity: service.validity,
            isActive: true,
          },
        });
        console.log(`✓ Added service: ${service.serviceName}`);
      }
    }

    // 3. Seed Sample Customer & Address
    const samplePhone = "9876543210";
    const existingCustomer = await prisma.customer.findUnique({
      where: { phoneNo: samplePhone },
    });

    if (!existingCustomer) {
      const hashedCustomerPassword = await bcrypt.hash("Password@123", 10);
      const customer = await prisma.customer.create({
        data: {
          customerName: "Ramesh Sharma",
          email: "customer@gmail.com",
          phoneNo: samplePhone,
          password: hashedCustomerPassword,
          customerType: "DOMESTIC",
        },
      });
      console.log(`✓ Sample customer created: ${samplePhone} (Password: Password@123)`);

      // Seed Address for Customer
      const address = await prisma.customerAddress.create({
        data: {
          customerId: customer.customerId,
          address: "Flat 402, Shree Jyotirling Apt, Sector 19, New Panvel, Navi Mumbai - 410206",
        },
      });

      // Seed Initial Booking
      const termService = await prisma.service.findFirst({
        where: { serviceName: "Anti-Termite Treatment" },
      });

      if (termService) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 2);

        await prisma.booking.create({
          data: {
            customerId: customer.customerId,
            serviceId: termService.serviceId,
            addressId: address.addressId,
            bookingDate: tomorrow,
            price: termService.price,
            status: "CONFIRMED",
          },
        });
        console.log("✓ Sample booking created (Status: CONFIRMED)");
      }
    } else {
      console.log(`✓ Sample customer already exists: ${samplePhone}`);
    }

    console.log("Database seeding finished successfully.");
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    if (shouldDisconnect) {
      await prisma.$disconnect();
    }
  }
};

// Run standalone if executed directly
if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  seedData(true);
}
