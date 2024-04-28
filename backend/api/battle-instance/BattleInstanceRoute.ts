import express from "express";
import CompleteRouter from "../CompleteRouter";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import BattleInstanceMapper from "./BattleInstanceMapper";
import { container } from "tsyringe";
import { BattleInstanceService } from "../../application/battleInstance/BattleInstanceService";
import PokemonMapper from "../pokemon/PokemonMapper";
import { IBattlePokemon } from "../../application/battle/BattleInterfaces";

const battleInstanceService = container.resolve<BattleInstanceService>(
  BattleInstanceService,
);
const pokemonMapper = container.resolve(PokemonMapper);
const router = express.Router();
const completeRouter = new CompleteRouter(
  container.resolve(BattleInstanceRepository),
  container.resolve(BattleInstanceMapper),
);

router.get("/ranking/:id", async (req, res, next) => {
  try {
    const obj = await battleInstanceService.getRanking(req.params.id);
    res.status(200).json(
      obj.map((value) => {
        value.directWins = undefined;
        return value;
      }),
    );
  } catch (err) {
    next(err);
  }
});

router.post("/simulateBattle", async (req, res, next) => {
  try {
    await battleInstanceService.simulateBattle(req.body._id);
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

router.get("/init-battle/:id", async (req, res, next) => {
  try {
    const result = await battleInstanceService.initBattle(req.params.id);
    result.player.pokemons = result.player.pokemons.map((value) => {
      return pokemonMapper.map(value) as IBattlePokemon;
    });
    result.opponent.pokemons = result.opponent.pokemons.map((value) => {
      return pokemonMapper.map(value) as IBattlePokemon;
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.use("/", completeRouter.router);

export default router;
