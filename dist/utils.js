"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add = add;
exports.getErrorMessage = getErrorMessage;
exports.getPaginationParameters = getPaginationParameters;
exports.getLevenshteinDistance = getLevenshteinDistance;
const config_1 = __importDefault(require("./config"));
function add(a, b) {
    return a + b;
}
function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (error && typeof error === "object" && "message" in error) {
        return String(error.message);
    }
    if (typeof error === "string") {
        return error;
    }
    return "An error occurred";
}
function getPaginationParameters(req) {
    const page = parseInt(req.query.page, 10);
    const perPage = parseInt(req.query.perPage, 10);
    const validPage = isNaN(page) || page < 1 ? 1 : page;
    const validPerPage = isNaN(perPage) || perPage < 1 ? config_1.default.defaultPageSize : perPage;
    const limit = validPerPage;
    const offset = (validPage - 1) * validPerPage;
    return {
        page: validPage,
        perPage: validPerPage,
        limit,
        offset,
    };
}
function getLevenshteinDistance(s1, s2) {
    const t1 = s1.toLowerCase().trim();
    const t2 = s2.toLowerCase().trim();
    if (t1 === t2)
        return 0;
    if (t1.length === 0)
        return t2.length;
    if (t2.length === 0)
        return t1.length;
    const matrix = [];
    for (let i = 0; i <= t2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= t1.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= t2.length; i++) {
        for (let j = 1; j <= t1.length; j++) {
            if (t2.charAt(i - 1) === t1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            }
            else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[t2.length][t1.length];
}
