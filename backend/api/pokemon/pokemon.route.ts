import express from "express";
import pokemonService from "./pokemon.service";
import CompleteRouter from "../CompleteRouter";

const router = express.Router();
const completeRouter = new CompleteRouter(pokemonService);

router.use("/", completeRouter.router);

export default router;
