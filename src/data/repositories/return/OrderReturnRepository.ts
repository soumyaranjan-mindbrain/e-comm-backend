import prisma from "../../../prisma-client";

export class OrderReturnRepository {
    // Create a new return request
    async createReturn(data: {
        orderId: string;
        productId: number;
        comId: number;
        returnReason: string;
        pickupDate: string | Date;
        refundAmount: number;
    }) {
        // Convert pickupDate to Date object if it's a string
        const pickupDateObj =
            typeof data.pickupDate === "string"
                ? new Date(data.pickupDate)
                : data.pickupDate;

        return (prisma as any).orderReturn.create({
            data: {
                orderId: data.orderId,
                productId: data.productId,
                comId: data.comId, // Required field
                returnReason: data.returnReason,
                pickupDate: pickupDateObj,
                refundAmount: data.refundAmount,
            },
        });
    }

    // Get all return requests, newest first
    async getAllReturns() {
        return (prisma as any).orderReturn.findMany({
            orderBy: { createdAt: "desc" }, // Use model field, NOT DB column
        });
    }

    // Get a return request by ID
    async getReturnById(returnId: number) {
        return (prisma as any).orderReturn.findUnique({
            where: { id: returnId },
        });
    }

    // Update return request status
    async updateReturnStatus(returnId: number, status: string) {
        const existing = await (prisma as any).orderReturn.findUnique({
            where: { id: returnId },
        });

        if (!existing) throw new Error(`Return with id ${returnId} not found`);

        return (prisma as any).orderReturn.update({
            where: { id: returnId },
            data: { status },
        });
    }
}
