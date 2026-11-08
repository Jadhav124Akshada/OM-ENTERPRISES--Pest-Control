
import { prisma } from "../config/db.js";

// ========================================
// 1. GET MY PROFILE
// ========================================
export const getMyProfile = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const customer = await prisma.customer.findUnique({
      where: { customerId },
      select: {
        customerId: true,
        customerName: true,
        email: true,
        phoneNo: true,
        customerType: true,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      customer,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 2. ADD ADDRESS
// ========================================
export const addAddress = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const { address } = req.body;

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const trimmedAddress = address.trim();

    // Check for duplicate address
    const existingAddress = await prisma.customerAddress.findFirst({
      where: {
        customerId,
        address: {
          equals: trimmedAddress,
        },
      },
    });

    if (existingAddress) {
      return res.status(400).json({
        success: false,
        message: "This address already exists in your profile.",
      });
    }

    const newAddress = await prisma.customerAddress.create({
      data: {
        customerId,
        address: trimmedAddress,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Add address error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 3. GET MY ADDRESSES
// ========================================
export const getMyAddresses = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const addresses = await prisma.customerAddress.findMany({
      where: { customerId },
    });

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 4. UPDATE ADDRESS
// ========================================
export const updateAddress = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const addressId = Number(req.params.addressId);
    const { address } = req.body;

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const existingAddress = await prisma.customerAddress.findFirst({
      where: {
        addressId,
        customerId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const updatedAddress = await prisma.customerAddress.update({
      where: { addressId },
      data: {
        address: address.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 5. DELETE ADDRESS
// ========================================
export const deleteAddress = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const addressId = Number(req.params.addressId);

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const existingAddress = await prisma.customerAddress.findFirst({
      where: {
        addressId,
        customerId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await prisma.customerAddress.delete({
      where: { addressId },
    });

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 6. ADMIN: GET ALL CUSTOMERS
// ========================================
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        customerId: true,
        customerName: true,
        email: true,
        phoneNo: true,
        customerType: true,
      },
    });

    return res.status(200).json({
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
