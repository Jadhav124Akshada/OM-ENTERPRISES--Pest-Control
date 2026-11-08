import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
    try {
        const { email, identifier, password } = req.body;
        const loginEmail = email || identifier;

        if (!loginEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Check whether admin exists
        const admin = await prisma.admin.findUnique({
            where: {
                email: loginEmail
            }
        });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: admin.adminId,
                role: "ADMIN"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token,
            admin: {
                adminId: admin.adminId,
                adminName: admin.adminName,
                email: admin.email
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            message: error.message ? `Login failed: ${error.message}` : "Something went wrong"
        });
    }
};


// GET PROFILE
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                adminId: req.user.id
            },
            select: {
                adminId: true,
                adminName: true,
                email: true,
                createdAt: true
            }
        });

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            message: "Admin profile fetched successfully",
            admin: admin
        });

    } catch (error) {
        console.error("Admin profile error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};
