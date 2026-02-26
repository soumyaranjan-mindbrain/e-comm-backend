"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAddress = exports.updateUserAddress = exports.createUserAddress = exports.getAllUserAddresses = exports.getUserAddressesByCustomerId = exports.getUserAddressById = void 0;
const userAddressRepository = __importStar(require("../../data/repositories/user-addresses/UserAddressRepository"));
const CustomerRepository_1 = require("../../data/repositories/auth/CustomerRepository");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const customerRepository = new CustomerRepository_1.CustomerRepository();
const getUserAddressById = async (id) => {
    const address = await userAddressRepository.getUserAddressById(id);
    if (!address) {
        throw AppError_1.default.notFound(`address not found`);
    }
    return address;
};
exports.getUserAddressById = getUserAddressById;
const getUserAddressesByCustomerId = async (customerId, limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return await userAddressRepository.getUserAddressesByCustomerId(customerId, queryLimit, queryCursor);
};
exports.getUserAddressesByCustomerId = getUserAddressesByCustomerId;
const getAllUserAddresses = async (limit, cursor) => {
    const queryLimit = limit && limit > 0 ? Math.floor(limit) : 20;
    const queryCursor = cursor && cursor > 0 ? Math.floor(cursor) : undefined;
    return await userAddressRepository.getAllUserAddresses(queryLimit, queryCursor);
};
exports.getAllUserAddresses = getAllUserAddresses;
const createUserAddress = async (data) => {
    if (data.pincode && !/^\d{6}$/.test(data.pincode)) {
        throw AppError_1.default.badRequest("pincode must be 6 digits");
    }
    if (data.receiversNumber &&
        !/^\d{10}$/.test(data.receiversNumber.replace(/\D/g, ""))) {
        throw AppError_1.default.badRequest("receiver's number must be 10 digits");
    }
    if (data.saveAs) {
        const validValues = ["Home", "Work", "Other"];
        if (!validValues.includes(data.saveAs)) {
            throw AppError_1.default.badRequest("invalid saveas value");
        }
    }
    return await userAddressRepository.createUserAddress(data);
};
exports.createUserAddress = createUserAddress;
const updateUserAddress = async (id, data) => {
    const existingAddress = await userAddressRepository.getUserAddressById(id);
    if (!existingAddress) {
        throw AppError_1.default.notFound(`address not found`);
    }
    // customerId renamed to userId in table but repo returns userId as property
    // Wait, let me check what type Prisma generates now
    const address = existingAddress;
    if (address.userId !== data.customerId) {
        throw AppError_1.default.forbidden("permission denied to update this address");
    }
    if (data.pincode && !/^\d{6}$/.test(data.pincode)) {
        throw AppError_1.default.badRequest("pincode must be 6 digits");
    }
    if (data.receiversNumber &&
        !/^\d{10}$/.test(data.receiversNumber.replace(/\D/g, ""))) {
        throw AppError_1.default.badRequest("receiver's number must be 10 digits");
    }
    if (data.saveAs) {
        const validValues = ["Home", "Work", "Other"];
        if (!validValues.includes(data.saveAs)) {
            throw AppError_1.default.badRequest("invalid saveas value");
        }
    }
    return await userAddressRepository.updateUserAddress(id, data);
};
exports.updateUserAddress = updateUserAddress;
const deleteUserAddress = async (id, customerId) => {
    const existingAddress = await userAddressRepository.getUserAddressById(id);
    if (!existingAddress) {
        throw AppError_1.default.notFound(`address not found`);
    }
    const address = existingAddress;
    if (address.userId !== customerId) {
        throw AppError_1.default.forbidden("permission denied to delete this address");
    }
    return await userAddressRepository.deleteUserAddress(id);
};
exports.deleteUserAddress = deleteUserAddress;
//# sourceMappingURL=UserAddressUseCase.js.map