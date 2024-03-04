import { Request, Response, Router, NextFunction } from "express";
import MoveLearningService from "./MoveLearningService";
const router: Router = Router();
const moveLearningService = MoveLearningService.getInstance();

router.put(
  "/learnableMoves",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const moves = await moveLearningService.learnableMoves(
        req.body.id,
        req.body.level,
        req.body.query
      );
      res.status(200).json(moves.filter((move) => move.power ?? 0 > 0));
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
