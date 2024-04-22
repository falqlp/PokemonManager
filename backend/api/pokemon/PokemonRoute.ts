import express, { Request, Response } from "express";
import CompleteRouter from "../CompleteRouter";
import PokemonService from "./PokemonService";
import EffectivenessService from "./EffectivenessService";
const effectivenessService = EffectivenessService.getInstance();
const pokemonService = PokemonService.getInstance();

const router = express.Router();
const completeRouter = new CompleteRouter(pokemonService);

router.put("/effectiveness", (req: Request, res: Response) => {
  try {
    const effectiveness = effectivenessService.calculateEffectiveness(req.body);
    res.status(200).json(effectiveness);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.get("/starters", async (req: Request, res: Response) => {
  try {
    const gameId = req.headers["game-id"] as string;
    res.status(200).json(await pokemonService.generateStarters(gameId));
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.use("/", completeRouter.router);

export default router;
