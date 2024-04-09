import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import "source-map-support/register";
import { RoutesMap } from "./RoutesMap";
import { convertStringsToDateInObject } from "./utils/DateConverter";
import CalendarEvent from "./api/calendar-event/CalendarEvent";
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, Game-Id, lang"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
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
export default app;
