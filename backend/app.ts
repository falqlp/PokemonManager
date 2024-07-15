import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import "source-map-support/register";
import { RoutesMap } from "./api/RoutesMap";
import { convertStringsToDateInObject } from "./utils/DateConverter";
import { container } from "tsyringe";
import { NotificationType } from "./websocket/WebsocketDataService";
import WebsocketUtils from "./websocket/WebsocketUtils";
import DamageEventRepository from "./domain/battleevents/damageevent/DamageEventRepository";

dotenv.config();

const app = express();
const mongoURI =
  !("1" === process.env.MONGODB_LOCAL) &&
  process.env.MONGODB_USERNAME &&
  process.env.MONGODB_PASSWORD
    ? `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.1eldau8.mongodb.net/PokemonManager`
    : "mongodb://127.0.0.1:27017/PokemonManager";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection error to MongoDB", error);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONT_URL);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Game-Id, lang",
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  convertStringsToDateInObject(req.body);
  next();
});

for (const routesKey in RoutesMap) {
  app.use(`/api/${routesKey}`, RoutesMap[routesKey]);
}
container
  .resolve(DamageEventRepository)
  .getTotalKoByPokemon("66843882267fef1365b1365c")
  .then(console.log);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const gameId = req.headers["game-id"] as string;
  container
    .resolve(WebsocketUtils)
    .notify("INTERNAL_ERROR", NotificationType.Error, gameId);
  res.status(500);
  res.json({
    error: err,
  });
});
export default app;
