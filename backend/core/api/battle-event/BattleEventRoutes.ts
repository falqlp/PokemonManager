import express from "express";
import { container } from "tsyringe";
import { BattleEventsService } from "../../application/BattleEvents/BattleEventsService";
import PokemonMapper from "../pokemon/PokemonMapper";

const router = express.Router();

const service = container.resolve(BattleEventsService);
const pokemonMapper = container.resolve(PokemonMapper);

router.put("/", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    const obj = await service.getBattleEventStats(
      gameId,
      req.body.type,
      req.body.isRelative,
      req.body.query,
      req.body.sort,
    );
    res.status(200).json(
      obj.map((o) => {
        o.pokemon = pokemonMapper.map(o.pokemon);
        return o;
      }),
    );
  } catch (err) {
    next(err);
  }
});

export default router;
