import express from "express";
import BattleService from "../../application/battle/BattleService";
const router = express.Router();
const battleService = BattleService.getInstance()

router.post("/simulateBattleRound", (req, res, next) => {
  const round = battleService.simulateBattleRound(
    req.body.trainer1,
    req.body.trainer2
  );
  res.status(200).json(round);
});

export default router;
