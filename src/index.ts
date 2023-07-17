import { httpServer } from "./http_server/index.js";
import { wss } from "./ws_server/index.js";

const HTTP_PORT: number = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

process.on("SIGINT", async () => {
    httpServer.close();
    wss.close();
    process.exit();
})