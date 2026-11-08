import { prisma } from "../config/db.js";

// ADD SERVICE (Option for Admin to Add Services)
export const addService = async (req, res) => {
    const { name, description, price, validity } = req.body;

    if (!name || !description || price === undefined || Number(price) <= 0) {
        return res.status(400).json({
            message: "Please provide valid service details (name, description, positive price)"
        });
    }

    try {
        const service = await prisma.service.create({
            data: {
                serviceName: name.trim(),
                description: description.trim(),
                price: Number(price),
                validity: validity !== undefined && Number(validity) > 0 ? Number(validity) : 30
            }
        });

        return res.status(201).json({
            message: "Service added successfully",
            service: service
        });

    } catch (error) {
        console.error("Add service error:", error);
        if (error.code === 'P2002') {
            return res.status(409).json({
                message: "A service with this name already exists"
            });
        }
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// VIEW ALL SERVICES (Used by Public & Admin)
export const getAllServices = async (req, res) => {
    try {
        const services = await prisma.service.findMany({
            orderBy: {
                serviceId: 'asc'
            }
        });

        return res.status(200).json({
            message: "Services fetched successfully",
            services: services
        });

    } catch (error) {
        console.error("Get services error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// UPDATE SERVICE
export const updateService = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, validity } = req.body;

    try {
        const serviceId = Number(id);

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).json({
                message: "Invalid service ID"
            });
        }

        const existingService = await prisma.service.findUnique({
            where: { serviceId: serviceId }
        });

        if (!existingService) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        const updatedService = await prisma.service.update({
            where: { serviceId: serviceId },
            data: {
                serviceName: name !== undefined ? name.trim() : undefined,
                description: description !== undefined ? description.trim() : undefined,
                price: price !== undefined ? Number(price) : undefined,
                validity: validity !== undefined ? Number(validity) : undefined
            }
        });

        return res.status(200).json({
            message: "Service updated successfully",
            service: updatedService
        });

    } catch (error) {
        console.error("Update service error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// UPDATE SERVICE STATUS (Toggle Active / Inactive)
export const updateServiceStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
        return res.status(400).json({
            message: "isActive must be true or false"
        });
    }

    try {
        const serviceId = Number(id);

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).json({
                message: "Invalid service ID"
            });
        }

        const existingService = await prisma.service.findUnique({
            where: { serviceId: serviceId }
        });

        if (!existingService) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        const updatedService = await prisma.service.update({
            where: { serviceId: serviceId },
            data: {
                isActive: isActive
            }
        });

        return res.status(200).json({
            message: "Service status updated successfully",
            service: updatedService
        });

    } catch (error) {
        console.error("Update service status error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

// DELETE SERVICE
export const deleteService = async (req, res) => {
    const { id } = req.params;

    try {
        const serviceId = Number(id);

        if (!Number.isInteger(serviceId) || serviceId <= 0) {
            return res.status(400).json({
                message: "Invalid service ID"
            });
        }

        const existingService = await prisma.service.findUnique({
            where: { serviceId: serviceId },
            include: {
                _count: {
                    select: { bookings: true }
                }
            }
        });

        if (!existingService) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        if (existingService._count.bookings > 0) {
            return res.status(409).json({
                message: "Cannot delete service because it has existing bookings. You can deactivate it instead."
            });
        }

        const deletedService = await prisma.service.delete({
            where: { serviceId: serviceId }
        });

        return res.status(200).json({
            message: "Service deleted successfully",
            service: deletedService
        });

    } catch (error) {
        console.error("Delete service error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
