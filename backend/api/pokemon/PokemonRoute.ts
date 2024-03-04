import express, { NextFunction, Request, Response } from "express";
import CompleteRouter from "../CompleteRouter";
import PokemonService from "./PokemonService";
import EffectivenessService from "./EffectivenessService";
const effectivenessService = EffectivenessService.getInstance();

const router = express.Router();
const completeRouter = new CompleteRouter(PokemonService.getInstance());

router.put(
  "/effectiveness",
  (req: Request, res: Response, next: NextFunction) => {
    const effectiveness = effectivenessService.calculateEffectiveness(req.body);
    res.status(200).json(effectiveness);
  }
);
router.use("/", completeRouter.router);

export default router;
