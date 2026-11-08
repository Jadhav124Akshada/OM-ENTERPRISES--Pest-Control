import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// CUSTOMER REGISTRATION
export const registerCustomer = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phoneNo,
      password,
      customerType,
    } = req.body;

    // 1. Validate required fields
    if (!customerName || !phoneNo || !password || !customerType) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // 2. Validate customer type
    if (!["DOMESTIC", "COMMERCIAL"].includes(customerType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer type",
      });
    }

    // 3. Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create customer in database
    const customer = await prisma.customer.create({
      data: {
        customerName,
        email: email || null,
        phoneNo,
        password: hashedPassword,
        customerType,
      },
      select: {
        customerId: true,
        customerName: true,
        email: true,
        phoneNo: true,
        customerType: true,
      },
    });

    // 6. Send response (do not issue auth token upon registration)
    return res.status(201).json({
      success: true,
      message: "Customer registered successfully. Please log in with your credentials.",
      customer,
    });

  } catch (error) {
    console.error("Registration error:", error);

    // Handle duplicate email or phone number
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message ? `Login failed: ${error.message}` : "Internal server error",
    });
  }
};



// CUSTOMER LOGIN
export const loginCustomer = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1. Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/phone and password are required",
      });
    }

    // 2. Find customer using email OR phone number
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phoneNo: identifier },
        ],
      },
    });

    // 3. Check if customer exists
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    // 4. Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      customer.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/phone or password",
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        customerId: customer.customerId,
        role: "CUSTOMER",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    // 6. Return customer details
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      customer: {
        customerId: customer.customerId,
        customerName: customer.customerName,
        email: customer.email,
        phoneNo: customer.phoneNo,
        customerType: customer.customerType,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};