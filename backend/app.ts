import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import loginRoutes from "./routes/login";
import pokemonBaseRoutes from "./api/pokemonBase/pokemonBase.route";
import pokemonRoutes from "./api/pokemon/pokemon.route";
import trainerRoutes from "./api/trainer/trainer.route";
import moveRoute from "./api/move/move.route";
import i18nService from "./i18n.service";
import battleInstanceRoutes from "./api/battle-instance/battle-instance.route";
import battleRoutes from "./api/battle/battle.route";
import moveLearningRoutes from "./api/moveLearning/moveLearning.routes";
import pcStorageRoutes from "./api/pcStorage/pcStorage.route";
import calendarEventRoutes from "./api/calendar-event/calendar-event.routes";
import gameRoutes from "./api/game/game.routes";
import experienceRoutes from "./api/experience/experience.routes";
import userRoutes from "./api/user/user.routes";
import nurseryRoutes from "./api/nursery/nursery.routes";
import TrainerService from "./api/trainer/trainer.service";
import { ITrainer } from "./api/trainer/trainer";

const app = express();
const mongoURI = "mongodb://127.0.0.1:27017/PokemonManager";

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

export default app;
