"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAddress = exports.updateUserAddress = exports.createUserAddress = exports.getAllUserAddresses = exports.getUserAddressesByCustomerId = exports.getUserAddressById = void 0;
const prisma_client_1 = __importDefault(require("../../prisma-client"));
const getUserAddressById = async (id) => {
    return prisma_client_1.default.userAddress.findUnique({
        where: { id },
        include: {
            customer: {
                select: {
                    id: true,
                    fullName: true,
                    emailId: true,
                },
            },
        },
    });
};
exports.getUserAddressById = getUserAddressById;
const getUserAddressesByCustomerId = async (customerId, limit = 20, cursor) => {
    const take = limit + 1;
    const where = { userId: customerId };
    const addresses = await prisma_client_1.default.userAddress.findMany({
        where: cursor ? { ...where, id: { lt: cursor } } : where,
        orderBy: { createdAt: "desc" },
        take,
        include: {
            customer: {
                select: {
                    id: true,
                    fullName: true,
                    emailId: true,
                },
            },
        },
    });
    const hasMore = addresses.length > limit;
    const data = hasMore ? addresses.slice(0, limit) : addresses;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getUserAddressesByCustomerId = getUserAddressesByCustomerId;
const getAllUserAddresses = async (limit = 20, cursor) => {
    const take = limit + 1;
    const addresses = await prisma_client_1.default.userAddress.findMany({
        where: cursor ? { id: { lt: cursor } } : undefined,
        orderBy: { createdAt: "desc" },
        take,
        include: {
            customer: {
                select: {
                    id: true,
                    fullName: true,
                    emailId: true,
                },
            },
        },
    });
    const hasMore = addresses.length > limit;
    const data = hasMore ? addresses.slice(0, limit) : addresses;
    const nextCursor = hasMore && data.length > 0 ? data[data.length - 1].id : null;
    return { data, nextCursor };
};
exports.getAllUserAddresses = getAllUserAddresses;
const createUserAddress = async (data) => {
    return prisma_client_1.default.userAddress.create({
        data: {
            userId: data.customerId,
            address: data.address,
            townCity: data.townCity,
            pincode: data.pincode,
            receiversName: data.receiversName,
            receiversNumber: data.receiversNumber,
            saveAs: data.saveAs,
            createdBy: data.createdBy,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    fullName: true,
                    emailId: true,
                },
            },
        },
    });
};
exports.createUserAddress = createUserAddress;
const updateUserAddress = async (id, data) => {
    return prisma_client_1.default.userAddress.update({
        where: { id },
        data: {
            userId: data.customerId,
            address: data.address,
            townCity: data.townCity,
            pincode: data.pincode,
            receiversName: data.receiversName,
            receiversNumber: data.receiversNumber,
            saveAs: data.saveAs,
            updatedBy: data.updatedBy,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    fullName: true,
                    emailId: true,
                },
            },
        },
    });
};
exports.updateUserAddress = updateUserAddress;
const deleteUserAddress = async (id) => {
    return prisma_client_1.default.userAddress.delete({
        where: { id },
    });
};
exports.deleteUserAddress = deleteUserAddress;
//# sourceMappingURL=UserAddressRepository.js.map