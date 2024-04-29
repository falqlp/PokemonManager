import express from "express";
import BattleService from "../../application/battle/BattleService";
import { container } from "tsyringe";
const router = express.Router();
const battleService = container.resolve(BattleService);

router.post("/simulateBattleRound", (req, res, next) => {
  try {
    const round = battleService.simulateNewBattleRound(
      req.body.player,
      req.body.opponent,
      req.body.battleOrder,
    );
    res.status(200).json(round);
  } catch (error) {
    next(error);
  }
});

export default router;
