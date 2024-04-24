import { Request, Response, Router } from "express";
import MoveLearningService from "../../application/moveLearning/MoveLearningService";
import { container } from "tsyringe";
const router: Router = Router();
const moveLearningService = container.resolve(MoveLearningService);

router.put("/learnableMoves", async (req: Request, res: Response, next) => {
  try {
    const moves = await moveLearningService.learnableMoves(
      req.body.id,
      req.body.level,
      req.body.query,
    );
    res.status(200).json(moves);
  } catch (error) {
    next(error);
  }
});

export default router;
