/**
 * Copyright (c) 2024 Discover Financial Services
*/
import { Server } from "./server.js";

async function main() {
    Server.run({port: parseInt(process.env.PORT || "3000")});
}

main();
