import express, { Request, Response } from "express";
import CompleteRouter from "../CompleteRouter";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import EffectivenessService from "../../application/pokemon/EffectivenessService";
import PokemonService from "../../application/pokemon/PokemonService";
import PokemonMapper from "./PokemonMapper";
const effectivenessService = EffectivenessService.getInstance();
const pokemonService = PokemonService.getInstance();
const pokemonMapper = PokemonMapper.getInstance();

const router = express.Router();
const completeRouter = new CompleteRouter(
  PokemonRepository.getInstance(),
  pokemonMapper,
);

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
    const starters = await pokemonService.generateStarters(gameId);
    starters.map((starter) => pokemonMapper.mapStarters(starter));
    res.status(200).json(starters);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.post("/", async (req: Request, res: Response) => {
  try {
    const gameId = req.headers["game-id"] as string;
    res
      .status(200)
      .json(pokemonMapper.map(await pokemonService.create(req.body, gameId)));
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.put("/:id", async (req: Request, res: Response) => {
  req.body.gameId = req.headers["game-id"] as string;
  try {
    res
      .status(200)
      .json(
        pokemonMapper.map(await pokemonService.update(req.params.id, req.body)),
      );
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.use("/", completeRouter.router);

export default router;
