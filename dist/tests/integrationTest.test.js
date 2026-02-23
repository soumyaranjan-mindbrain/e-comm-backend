"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
describe("Health endpoint tests", () => {
    test("Health endpoint returns ok 200", async () => {
        await (0, supertest_1.default)((0, server_1.createServer)())
            .get("/v1/health")
            .expect(200)
            .then((res) => {
            expect(res.body.status).toBe("success");
        });
    });
});
//# sourceMappingURL=integrationTest.test.js.map