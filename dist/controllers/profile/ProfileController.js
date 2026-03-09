"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPhoto = exports.updateProfile = exports.getProfile = void 0;
const CustomerRepository_1 = require("../../data/repositories/auth/CustomerRepository");
const GetProfileUseCase_1 = require("../../usecases/user/GetProfileUseCase");
const UpdateProfileUseCase_1 = require("../../usecases/user/UpdateProfileUseCase");
const CloudinaryService_1 = require("../../services/CloudinaryService");
const customerRepository = new CustomerRepository_1.CustomerRepository();
const getProfileUseCase = new GetProfileUseCase_1.GetProfileUseCase(customerRepository);
const updateProfileUseCase = new UpdateProfileUseCase_1.UpdateProfileUseCase(customerRepository);
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "unauthorized", data: null });
            return;
        }
        const profile = await getProfileUseCase.execute(userId);
        res.status(200).json({
            success: true,
            message: "profile fetched successfully",
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "unauthorized", data: null });
            return;
        }
        const profile = await updateProfileUseCase.execute(userId, req.body);
        res.status(200).json({
            success: true,
            message: "profile updated successfully",
            data: profile,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProfile = updateProfile;
const uploadPhoto = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "unauthorized", data: null });
            return;
        }
        if (!req.file) {
            res.status(400).json({ success: false, message: "no file uploaded" });
            return;
        }
        // 1. Upload to Cloudinary
        const { url: imageUrl } = await CloudinaryService_1.cloudinaryService.uploadImage(req.file.buffer, "bm2mall/profiles");
        // 2. Update profile in database
        const profile = await updateProfileUseCase.execute(userId, {
            profileImage: imageUrl,
        });
        res.status(200).json({
            success: true,
            message: "photo uploaded and profile updated successfully",
            data: {
                profileImage: imageUrl,
                user: profile,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadPhoto = uploadPhoto;
