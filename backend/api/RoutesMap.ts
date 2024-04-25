import loginRoutes from "./login/LoginRoutes";
import pokemonBaseRoutes from "./pokemonBase/PokemonBaseRoute";
import pokemonRoutes from "./pokemon/PokemonRoute";
import trainerRoutes from "./trainer/TrainerRoute";
import moveRoute from "./move/MoveRoute";
import battleInstanceRoutes from "./battle-instance/BattleInstanceRoute";
import battleRoutes from "./battle/BattleRoute";
import moveLearningRoutes from "./moveLearning/MoveLearningRoutes";
import pcStorageRoutes from "./pcStorage/PcStorageRoute";
import calendarEventRoutes from "./calendar-event/CalendarEventRoutes";
import gameRoutes from "./game/GameRoutes";
import experienceRoutes from "./experience/ExperienceRoutes";
import userRoutes from "./user/UserRoutes";
import nurseryRoutes from "./nursery/NurseryRoutes";
import pokedexRouter from "./pokedex/PokedexRouter";
import competitionRoutes from "./competition/CompetitionRoutes";
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
  competition: competitionRoutes,
};
