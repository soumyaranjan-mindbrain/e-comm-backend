import { OrderReturnRepository } from "../../data/repositories/return/OrderReturnRepository";

const repo = new OrderReturnRepository();

export const createReturnUseCase = async (data: any) => {
    return repo.createReturn(data);
};

export const getAllReturnsUseCase = async () => {
    return repo.getAllReturns();
};

export const updateReturnStatusUseCase = async (
    returnId: number,
    status: string,
) => {
    if (!["APPROVED", "REJECTED"].includes(status)) {
        throw new Error("Invalid status value");
    }
    return repo.updateReturnStatus(returnId, status);
};

export const getReturnByIdUseCase = async (returnId: number) => {
    return repo.getReturnById(returnId);
};
