import { prisma } from "../config/db.js";

// ========================================
// 1. CREATE BOOKING
// ========================================
export const createBooking = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const { serviceId, addressId, bookingDate } = req.body;

    if (!serviceId || !addressId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "Service ID, address ID and booking date are required",
      });
    }

    const parsedServiceId = Number(serviceId);
    const parsedAddressId = Number(addressId);

    if (
      !Number.isInteger(parsedServiceId) || parsedServiceId <= 0 ||
      !Number.isInteger(parsedAddressId) || parsedAddressId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID or address ID",
      });
    }

    const startDate = new Date(bookingDate);

    if (Number.isNaN(startDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking date",
      });
    }

    const service = await prisma.service.findFirst({
      where: { serviceId: parsedServiceId, isActive: true },
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found or inactive",
      });
    }

    const address = await prisma.customerAddress.findFirst({
      where: {
        addressId: parsedAddressId,
        customerId,
      },
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found in your profile",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        serviceId: parsedServiceId,
        addressId: parsedAddressId,
        bookingDate: startDate,
        status: "PENDING",
        expiryDate: null,
        completedAt: null,
        price: service.price,
      },
      include: {
        service: true,
        address: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 2. GET MY BOOKINGS
// ========================================
export const getMyBookings = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const bookings = await prisma.booking.findMany({
      where: { customerId },
      include: {
        service: true,
        address: true,
      },
      orderBy: { bookingDate: "desc" },
    });

    const updatedBookings = bookings.map((booking) => {
      let remainingDays = null;
      let isExpired = false;

      if (booking.status === "COMPLETED" && booking.expiryDate) {
        const today = new Date();
        const expiry = new Date(booking.expiryDate);

        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        remainingDays = Math.max(
          0,
          Math.ceil(
            (expiry.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );

        isExpired = remainingDays === 0;
      }

      return { ...booking, remainingDays, isExpired };
    });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      totalBookings: updatedBookings.length,
      bookings: updatedBookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 3. GET BOOKING DETAILS
// ========================================
export const getBookingById = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const bookingId = Number(req.params.bookingId);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await prisma.booking.findFirst({
      where: { bookingId, customerId },
      include: {
        service: true,
        address: true,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    let remainingDays = null;
    let isExpired = false;

    if (booking.status === "COMPLETED" && booking.expiryDate) {
      const today = new Date();
      const expiry = new Date(booking.expiryDate);

      today.setHours(0, 0, 0, 0);
      expiry.setHours(0, 0, 0, 0);

      remainingDays = Math.max(
        0,
        Math.ceil(
          (expiry.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );

      isExpired = remainingDays === 0;
    }

    return res.status(200).json({
      success: true,
      message: "Booking details fetched successfully",
      booking: { ...booking, remainingDays, isExpired },
    });
  } catch (error) {
    console.error("Get booking details error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 4. CANCEL BOOKING
// ========================================
export const cancelBooking = async (req, res) => {
  try {
    const customerId = req.user.customerId;
    const bookingId = Number(req.params.bookingId);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await prisma.booking.findFirst({
      where: { bookingId, customerId },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "CONFIRMED") {
      return res.status(400).json({
        success: false,
        message: "Booking has already been confirmed by admin and cannot be cancelled",
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Completed booking cannot be cancelled",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingId },
      data: { status: "CANCELLED" },
      include: {
        service: true,
        address: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 5. COMPLETE BOOKING (ADMIN)
// ========================================
export const completeBooking = async (req, res) => {
  try {
    const bookingId = Number(req.params.bookingId);

    if (!Number.isInteger(bookingId) || bookingId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingId },
      include: { service: true },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "Cancelled booking cannot be completed",
      });
    }

    if (booking.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Booking is already completed",
      });
    }

    const validity = booking.service.validity;

    if (!Number.isInteger(validity) || validity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid service validity",
      });
    }

    const completedAt = new Date();
    const expiryDate = new Date(completedAt);
    expiryDate.setDate(expiryDate.getDate() + validity);

    const updatedBooking = await prisma.booking.update({
      where: { bookingId },
      data: {
        status: "COMPLETED",
        completedAt,
        expiryDate,
      },
      include: {
        service: true,
        customer: {
          select: {
            customerId: true,
            customerName: true,
            email: true,
            phoneNo: true,
          },
        },
        address: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Booking completed and expiry date calculated successfully",
      validityDays: validity,
      completedAt,
      expiryDate,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Complete booking error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ========================================
// 6. ADMIN: GET ALL BOOKINGS
// ========================================
export const getAllBookings = async (req, res) => {
  const { status } = req.query;

  try {
    const bookingStatus = status?.toUpperCase();

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (bookingStatus && !allowedStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const bookings = await prisma.booking.findMany({
      where: bookingStatus ? { status: bookingStatus } : {},
      include: {
        customer: {
          select: {
            customerId: true,
            customerName: true,
            email: true,
            phoneNo: true,
          },
        },
        service: true,
        address: true,
      },
      orderBy: { bookingDate: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ========================================
// 7. ADMIN: UPDATE BOOKING STATUS
// ========================================
export const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    const bookingStatus = status?.toUpperCase();

    const allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const bookingIdNumber = Number(bookingId);

    if (!Number.isInteger(bookingIdNumber) || bookingIdNumber <= 0) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { bookingId: bookingIdNumber },
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (existingBooking.status === "CANCELLED") {
      return res.status(400).json({
        success: false,
        message: "This booking was cancelled by the customer and all admin options are locked",
      });
    }

    if (existingBooking.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "This booking is already completed and cannot be modified",
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { bookingId: bookingIdNumber },
      data: { status: bookingStatus },
      include: {
        customer: {
          select: {
            customerId: true,
            customerName: true,
            email: true,
            phoneNo: true,
          },
        },
        service: true,
        address: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
