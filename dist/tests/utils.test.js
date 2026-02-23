"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("@/config"));
const utils_1 = require("@/utils");
describe("getErrorMessage", () => {
    test("should return message from an Error instance", () => {
        const error = new Error("Something went wrong");
        expect((0, utils_1.getErrorMessage)(error)).toBe("Something went wrong");
    });
    test("should return message from an object with a message property", () => {
        const error = { message: "Custom error message" };
        expect((0, utils_1.getErrorMessage)(error)).toBe("Custom error message");
    });
});
describe("getPaginationParameters", () => {
    test("should return default values when page and perPage are missing", () => {
        const req = { query: {} };
        expect((0, utils_1.getPaginationParameters)(req)).toEqual({
            page: 1,
            perPage: config_1.default.defaultPageSize,
            limit: config_1.default.defaultPageSize,
            offset: 0,
        });
    });
    test("should parse valid page and perPage values", () => {
        const req = { query: { page: "2", perPage: "20" } };
        expect((0, utils_1.getPaginationParameters)(req)).toEqual({
            page: 2,
            perPage: 20,
            limit: 20,
            offset: 20,
        });
    });
});
