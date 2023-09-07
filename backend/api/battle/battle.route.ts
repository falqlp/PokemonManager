import express from "express";
const router = express.Router();
import battleService from "./battle.service";

router.post("/simulateBattleRound", (req, res, next) => {
  const round = battleService.simulateBattleRound(
    req.body.trainer1,
    req.body.trainer2
  );
  res.status(200).json(round);
});

export default router;
