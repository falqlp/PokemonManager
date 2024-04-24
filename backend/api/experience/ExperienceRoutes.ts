import { Router } from "express";
import ExperienceService from "../../application/experience/ExperienceService";
import { container } from "tsyringe";

const router: Router = Router();
const experienceService = container.resolve(ExperienceService);

router.get("/weeklyXpGain/:id", (req, res) => {
  experienceService.weeklyXpGain(req.params.id).then((result) => {
    res.status(200).json(result);
  });
});

export default router;
