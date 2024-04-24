import express, { Router } from "express";
import PokemonBaseRepository from "../../domain/pokemonBase/PokemonBaseRepository";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";
import PokemonBaseMapper from "./PokemonBaseMapper";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  PokemonBaseRepository.getInstance(),
  PokemonBaseMapper,
);

router.use("/", readOnlyRouter.router);

export default router;
