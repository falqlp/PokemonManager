import http from "http";
import https from "https";
import fs from "fs";
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
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
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

let server: any;

const sslOptions = {
  keyPath:
    "/etc/letsencrypt/live/pokemon-manager.francecentral.cloudapp.azure.com/privkey.pem",
  certPath:
    "/etc/letsencrypt/live/pokemon-manager.francecentral.cloudapp.azure.com/fullchain.pem",
};

if (fs.existsSync(sslOptions.keyPath) && fs.existsSync(sslOptions.certPath)) {
  const options = {
    key: fs.readFileSync(sslOptions.keyPath),
    cert: fs.readFileSync(sslOptions.certPath),
  };
  server = https.createServer(options, app);
  console.log("Lancement du serveur en mode HTTPS.");
} else {
  server = http.createServer(app);
  console.log("Lancement du serveur en mode HTTP.");
}

initializeWebSocketServer(server);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address() as AddressInfo;
  const bind = typeof address === "string" ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

server.listen(port);
