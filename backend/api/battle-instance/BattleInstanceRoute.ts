import express from "express";
import CompleteRouter from "../CompleteRouter";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import BattleInstanceMapper from "./BattleInstanceMapper";
import { container } from "tsyringe";
import { BattleInstanceService } from "../../application/battleInstance/BattleInstanceService";

const battleInstanceService = container.resolve<BattleInstanceService>(
  BattleInstanceService,
);
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

router.use("/", completeRouter.router);

export default router;
