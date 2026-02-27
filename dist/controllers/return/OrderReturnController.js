"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReturnStatus = exports.getReturnById = exports.getReturnRequests = exports.createReturnRequest = void 0;
const OrderReturnUseCase_1 = require("../../usecases/return/OrderReturnUseCase");
const createReturnRequest = async (req, res, next) => {
    try {
        const result = await (0, OrderReturnUseCase_1.createReturnUseCase)(req.body);
        res.status(201).json({
            success: true,
            message: "Return request created",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.createReturnRequest = createReturnRequest;
const getReturnRequests = async (_req, res, next) => {
    try {
        const returns = await (0, OrderReturnUseCase_1.getAllReturnsUseCase)();
        res.status(200).json({
            success: true,
            data: returns
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getReturnRequests = getReturnRequests;
const getReturnById = async (req, res, next) => {
    try {
        const returnId = parseInt(req.params.returnId);
        const result = await (0, OrderReturnUseCase_1.getReturnByIdUseCase)(returnId);
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.getReturnById = getReturnById;
const updateReturnStatus = async (req, res, next) => {
    try {
        const returnId = parseInt(req.params.returnId);
        const { status } = req.body;
        const updated = await (0, OrderReturnUseCase_1.updateReturnStatusUseCase)(returnId, status);
        res.status(200).json({
            success: true,
            message: "Return status updated",
            data: updated
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateReturnStatus = updateReturnStatus;
