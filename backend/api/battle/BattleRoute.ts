import express from "express";
import BattleService from "../../application/battle/BattleService";
import { container } from "tsyringe";
const router = express.Router();
const battleService = container.resolve(BattleService);

router.post("/simulateBattleRound", (req, res) => {
  const round = battleService.simulateBattleRound(
    req.body.trainer1,
    req.body.trainer2,
  );
  res.status(200).json(round);
});

export default router;
