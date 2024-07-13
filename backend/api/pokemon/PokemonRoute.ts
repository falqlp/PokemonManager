import express, { Request, Response } from "express";
import CompleteRouter from "../CompleteRouter";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import EffectivenessService from "../../application/pokemon/EffectivenessService";
import PokemonService from "../../application/pokemon/PokemonService";
import PokemonMapper from "./PokemonMapper";
import { container } from "tsyringe";
import { IPokemon } from "../../domain/pokemon/Pokemon";
const effectivenessService = container.resolve(EffectivenessService);
const pokemonService = container.resolve(PokemonService);
const pokemonMapper = container.resolve(PokemonMapper);

const router = express.Router();
const completeRouter = new CompleteRouter(
  container.resolve(PokemonRepository),
  pokemonMapper,
);

router.put("/effectiveness", (req: Request, res: Response, next) => {
  try {
    const effectiveness = effectivenessService.calculateEffectiveness(req.body);
    res.status(200).json(effectiveness);
  } catch (err) {
    next(err);
  }
});
router.get("/starters/:id", async (req: Request, res: Response, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    const starters = await pokemonService.generateStarters(
      gameId,
      req.params.id,
    );
    starters.map((starter) => pokemonMapper.mapStarters(starter));
    res.status(200).json(starters);
  } catch (err) {
    next(err);
  }
});
router.post("/starters", async (req: Request, res: Response, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    for (const pokemon of req.body.starters as IPokemon[]) {
      await pokemonService.create(pokemon, gameId);
    }
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});
router.put("/:id", async (req: Request, res: Response, next) => {
  req.body.gameId = req.headers["game-id"] as string;
  try {
    res
      .status(200)
      .json(
        pokemonMapper.map(await pokemonService.update(req.params.id, req.body)),
      );
  } catch (err) {
    next(err);
  }
});
router.put("/changeNickname", async (req: Request, res: Response, next) => {
  const gameId = req.headers["game-id"] as string;
  try {
    await pokemonService.changeNickname(
      req.body.pokemonId,
      req.params.nickname,
      gameId,
    );
    res.status(200);
  } catch (err) {
    next(err);
  }
});
router.post("/", async (req: Request, res: Response, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    res
      .status(200)
      .json(pokemonMapper.map(await pokemonService.create(req.body, gameId)));
  } catch (err) {
    next(err);
  }
});
router.use("/", completeRouter.router);

export default router;
