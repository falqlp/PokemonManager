import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import loginRoutes from "./routes/login";
import pokemonBaseRoutes from "./api/pokemonBase/PokemonBaseRoute";
import pokemonRoutes from "./api/pokemon/PokemonRoute";
import trainerRoutes from "./api/trainer/TrainerRoute";
import moveRoute from "./api/move/MoveRoute";
import i18nService from "./i18n.service";
import battleInstanceRoutes from "./api/battle-instance/BattleInstanceRoute";
import battleRoutes from "./api/battle/BattleRoute";
import moveLearningRoutes from "./api/moveLearning/MoveLearningRoutes";
import pcStorageRoutes from "./api/pcStorage/PcStorageRoute";
import calendarEventRoutes from "./api/calendar-event/CalendarEventRoutes";
import gameRoutes from "./api/game/GameRoutes";
import experienceRoutes from "./api/experience/ExperienceRoutes";
import userRoutes from "./api/user/UserRoutes";
import nurseryRoutes from "./api/nursery/NurseryRoutes";
import TrainerService from "./api/trainer/TrainerService";
import { ITrainer } from "./api/trainer/Trainer";
import pokedexRouter from "./api/pokedex/PokedexRouter";
import dotenv from "dotenv";
import "source-map-support/register";
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

// migrationService.updatePokemonInfo();
i18nService.checkAndSortLanguageFiles();
i18nService
  .translationsToDatabase()
  .then(() => console.info("Backend started"));
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

app.use("/api/pokemonBase", pokemonBaseRoutes);
app.use("/api/pokemon", pokemonRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/move", moveRoute);
app.use("/api/battleInstance", battleInstanceRoutes);
app.use("/api/battle", battleRoutes);
app.use("/api/moveLearning", moveLearningRoutes);
app.use("/api/pcStorage", pcStorageRoutes);
app.use("/api/calendar-event", calendarEventRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/xp", experienceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/nursery", nurseryRoutes);
app.use("/api/pokedex", pokedexRouter);

export default app;
