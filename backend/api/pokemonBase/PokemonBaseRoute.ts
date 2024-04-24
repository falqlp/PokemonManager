import express, { Router } from "express";
import PokemonBaseRepository from "../../domain/pokemonBase/PokemonBaseRepository";
import ReadOnlyGlobalRouter from "../ReadOnlyGlobalRouter";
import PokemonBaseMapper from "./PokemonBaseMapper";
import { container } from "tsyringe";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyGlobalRouter(
  container.resolve(PokemonBaseRepository),
  PokemonBaseMapper,
);

router.use("/", readOnlyRouter.router);

export default router;
