import Server from "./config/Server";

const port = Number(process.env.API_PORT);
const server = new Server(port);
server.start();