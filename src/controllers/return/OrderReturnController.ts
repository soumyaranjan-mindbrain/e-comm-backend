import { Request, Response, NextFunction } from "express";
import {
    createReturnUseCase,
    getAllReturnsUseCase,
    updateReturnStatusUseCase,
    getReturnByIdUseCase,
} from "../../usecases/return/OrderReturnUseCase";

export const createReturnRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await createReturnUseCase(req.body);
        res.status(201).json({
            success: true,
            message: "Return request created",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getReturnRequests = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const returns = await getAllReturnsUseCase();
        res.status(200).json({
            success: true,
            data: returns
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getReturnById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const returnId = parseInt(req.params.returnId);
        const result = await getReturnByIdUseCase(returnId);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updateReturnStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const returnId = parseInt(req.params.returnId);
        const { status } = req.body;
        const updated = await updateReturnStatusUseCase(returnId, status);
        res.status(200).json({
            success: true,
            message: "Return status updated",
            data: updated
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
