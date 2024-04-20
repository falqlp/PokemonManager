import { Request, Response, Router, NextFunction } from "express";
import MoveLearningService from "../../application/moveLearning/MoveLearningService";
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
      res.status(200).json(moves);
    } catch (error) {
      console.log(error);
    }
  }
);

export default router;
