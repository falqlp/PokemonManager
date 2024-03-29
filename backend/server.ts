import http from "http";
import app from "./app";
import { AddressInfo } from "net";
import { initializeWebSocketServer } from "./websocketServer";

const normalizePort = (val: string | number): number | string | boolean => {
  const port = parseInt(String(val), 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address() as AddressInfo;
  const bind =
    typeof address === "string" ? "pipes " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

initializeWebSocketServer(server);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address() as AddressInfo;
  const bind = typeof address === "string" ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

server.listen(port);
