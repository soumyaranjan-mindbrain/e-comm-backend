"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
exports.hashOtp = hashOtp;
exports.compareOtp = compareOtp;
// src/util/crypto.ts
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate 6 digit OTP
 */
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
/**
 * Hash OTP using SHA256
 */
function hashOtp(otp) {
    return crypto_1.default.createHash("sha256").update(otp).digest("hex");
}
/**
 * Compare raw OTP with hashed OTP
 */
function compareOtp(otpInput, hashedOtp) {
    return hashOtp(otpInput) === hashedOtp;
}
