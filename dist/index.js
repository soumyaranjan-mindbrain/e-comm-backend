"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
require("reflect-metadata");
const server_1 = require("./server");
const config_1 = __importDefault(require("./config"));
const server = (0, server_1.createServer)();
server.listen(config_1.default.port, () => {
    console.log(`api running on ${config_1.default.port}`);
});
//# sourceMappingURL=index.js.map