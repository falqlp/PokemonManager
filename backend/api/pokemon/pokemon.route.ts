import express from "express";
import pokemonService from "./pokemon.service";
import CompleteRouter from "../CompleteRouter";
import PokemonService from "./pokemon.service";

const router = express.Router();
const completeRouter = new CompleteRouter(PokemonService.getInstance());

router.use("/", completeRouter.router);

export default router;
