import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./config/db.js";

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        const admin = await prisma.admin.create({
            data: {
                adminName: "Administrator",
                email: "admin@gmail.com",
                password: hashedPassword
            }
        });

        console.log("Admin created successfully!");
        console.log("Admin email:", admin.email);

    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await prisma.$disconnect();
    }
};

createAdmin();