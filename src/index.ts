import "module-alias/register";
import "reflect-metadata";
import { createServer } from "./server";
import config from "./config";

const server = createServer();

server.listen(config.port, "0.0.0.0", () => {
  console.log(`api running on ${config.port}`);
});
