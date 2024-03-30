import loginRoutes from "./routes/login";
import pokemonBaseRoutes from "./api/pokemonBase/PokemonBaseRoute";
import pokemonRoutes from "./api/pokemon/PokemonRoute";
import trainerRoutes from "./api/trainer/TrainerRoute";
import moveRoute from "./api/move/MoveRoute";
import battleInstanceRoutes from "./api/battle-instance/BattleInstanceRoute";
import battleRoutes from "./api/battle/BattleRoute";
import moveLearningRoutes from "./api/moveLearning/MoveLearningRoutes";
import pcStorageRoutes from "./api/pcStorage/PcStorageRoute";
import calendarEventRoutes from "./api/calendar-event/CalendarEventRoutes";
import gameRoutes from "./api/game/GameRoutes";
import experienceRoutes from "./api/experience/ExperienceRoutes";
import userRoutes from "./api/user/UserRoutes";
import nurseryRoutes from "./api/nursery/NurseryRoutes";
import pokedexRouter from "./api/pokedex/PokedexRouter";
import { Router } from "express";

export const RoutesMap: Record<string, Router> = {
  pokemonBase: pokemonBaseRoutes,
  pokemon: pokemonRoutes,
  trainer: trainerRoutes,
  login: loginRoutes,
  move: moveRoute,
  battleInstance: battleInstanceRoutes,
  battle: battleRoutes,
  moveLearning: moveLearningRoutes,
  pcStorage: pcStorageRoutes,
  "calendar-event": calendarEventRoutes,
  game: gameRoutes,
  xp: experienceRoutes,
  user: userRoutes,
  nursery: nurseryRoutes,
  pokedex: pokedexRouter,
};
