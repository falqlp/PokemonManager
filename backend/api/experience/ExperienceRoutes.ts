import { Router } from "express";
import ExperienceService from "../../application/experience/ExperienceService";
import { container } from "tsyringe";

const router: Router = Router();
const experienceService = container.resolve(ExperienceService);

router.get("/weeklyXpGain/:id", async (req, res, next) => {
  try {
    const obj = await experienceService.weeklyXpGain(req.params.id);
    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
});

export default router;
