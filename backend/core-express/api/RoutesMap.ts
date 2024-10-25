import loginRoutes from "./login/LoginRoutes";
import pokemonBaseRoutes from "./pokemonBase/PokemonBaseRoute";
import pokemonRoutes from "./pokemon/PokemonRoute";
import trainerRoutes from "./trainer/TrainerRoute";
import moveRoute from "./move/MoveRoute";
import battleInstanceRoutes from "./battle-instance/BattleInstanceRoute";
import moveLearningRoutes from "./moveLearning/MoveLearningRoutes";
import pcStorageRoutes from "./pcStorage/PcStorageRoute";
import calendarEventRoutes from "./calendar-event/CalendarEventRoutes";
import gameRoutes from "./game/GameRoutes";
import userRoutes from "./user/UserRoutes";
import nurseryRoutes from "./nursery/NurseryRoutes";
import pokedexRouter from "./pokedex/PokedexRouter";
import competitionRoutes from "./competition/CompetitionRoutes";
import passwordRequestRoutes from "./passwordRequest/PasswordRequestRoutes";
import mailRoutes from "./mail/MailRoutes";
import competitionHistoryRoutes from "./competitionHistory/CompetitionHistoryRoutes";
import { Router } from "express";
import battleEventRoutes from "./battle-event/BattleEventRoutes";

export const RoutesMap: Record<string, Router> = {
  pokemonBase: pokemonBaseRoutes,
  pokemon: pokemonRoutes,
  trainer: trainerRoutes,
  login: loginRoutes,
  move: moveRoute,
  battleInstance: battleInstanceRoutes,
  moveLearning: moveLearningRoutes,
  pcStorage: pcStorageRoutes,
  "calendar-event": calendarEventRoutes,
  game: gameRoutes,
  user: userRoutes,
  nursery: nurseryRoutes,
  pokedex: pokedexRouter,
  competition: competitionRoutes,
  "password-request": passwordRequestRoutes,
  email: mailRoutes,
  "competition-history": competitionHistoryRoutes,
  "battle-events": battleEventRoutes,
};
