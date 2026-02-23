import { Response, NextFunction, Request } from "express";
import { CustomerRepository } from "../../data/repositories/auth/CustomerRepository";
import { GetProfileUseCase } from "../../usecases/user/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../usecases/user/UpdateProfileUseCase";
import { AuthRequest } from "../../middleware/authenticate-user";
import { cloudinaryService } from "../../services/CloudinaryService";

const customerRepository = new CustomerRepository();
const getProfileUseCase = new GetProfileUseCase(customerRepository);
const updateProfileUseCase = new UpdateProfileUseCase(customerRepository);

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, msg: "unauthorized", data: null });
      return;
    }

    const profile = await getProfileUseCase.execute(userId);

    res.status(200).json({
      success: true,
      msg: "profile fetched successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, msg: "unauthorized", data: null });
      return;
    }

    const profile = await updateProfileUseCase.execute(userId, req.body);

    res.status(200).json({
      success: true,
      msg: "profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) {
      res.status(401).json({ success: false, msg: "unauthorized", data: null });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, msg: "no file uploaded" });
      return;
    }

    // 1. Upload to Cloudinary
    const imageUrl = await cloudinaryService.uploadImage(
      req.file.buffer,
      "bm2mall/profiles",
    );

    // 2. Update profile in database
    const profile = await updateProfileUseCase.execute(userId, {
      profileImage: imageUrl,
    });

    res.status(200).json({
      success: true,
      msg: "photo uploaded and profile updated successfully",
      data: {
        profileImage: imageUrl,
        user: profile,
      },
    });
  } catch (error) {
    next(error);
  }
};
