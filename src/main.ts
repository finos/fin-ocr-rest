/**
 * Copyright (c) 2024 Capital One
*/
import { Server } from "./server.js";

async function main() {
    Server.run({port: parseInt(process.env.PORT || "3000")});
}

main();
