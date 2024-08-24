import express, { Request, Response } from "express";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import EffectivenessService from "../../application/pokemon/EffectivenessService";
import PokemonService from "../../application/pokemon/PokemonService";
import PokemonMapper from "./PokemonMapper";
import { container } from "tsyringe";
import { IPokemon } from "../../domain/pokemon/Pokemon";
import ReadOnlyRouter from "../ReadOnlyRouter";
const effectivenessService = container.resolve(EffectivenessService);
const pokemonService = container.resolve(PokemonService);
const pokemonMapper = container.resolve(PokemonMapper);

const router = express.Router();
const readOnlyRouter = new ReadOnlyRouter(
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
router.put("/changeNickname", async (req: Request, res: Response, next) => {
  const gameId = req.headers["game-id"] as string;
  try {
    await pokemonService.changeNickname(
      req.body.pokemonId,
      req.body.nickname,
      gameId,
    );
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});
router.put("/modify-moves", async (req: Request, res: Response, next) => {
  const gameId = req.headers["game-id"] as string;
  try {
    await pokemonService.modifyMoves(
      req.body.pokemonId,
      req.body.movesId,
      req.body.trainerId,
      gameId,
    );
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});
router.put("/modify-strategy", async (req: Request, res: Response, next) => {
  const gameId = req.headers["game-id"] as string;
  try {
    await pokemonService.modifyMoveStrategy(
      req.body.strategies,
      req.body.trainerId,
      gameId,
    );
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});
router.put(
  "/modify-battle-strategy",
  async (req: Request, res: Response, next) => {
    const gameId = req.headers["game-id"] as string;
    try {
      await pokemonService.modifyBattleMoveStrategy(
        req.body.strategies,
        req.body.trainerId,
        gameId,
      );
      res.status(200).json();
    } catch (err) {
      next(err);
    }
  },
);
router.put("/hatch-egg", async (req: Request, res: Response, next) => {
  const gameId = req.headers["game-id"] as string;
  try {
    await pokemonService.hatchEgg(req.body.pokemonId, gameId);
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});
router.put("/evolve", async (req: Request, res: Response, next) => {
  const gameId = req.headers["game-id"] as string;
  try {
    await pokemonService.evolve(req.body.pokemonId, gameId);
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});
router.delete("/release/:id", async (req: Request, res: Response, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    await pokemonService.releasePokemon(req.params.id, gameId);
    res.status(200).json();
  } catch (err) {
    next(err);
  }
});
router.use("/", readOnlyRouter.router);

export default router;
