import { Router } from "express";
import ExperienceService from "./ExperienceService";

const router: Router = Router();
const experienceService = ExperienceService.getInstance();

router.get("/weeklyXpGain/:id", (req, res) => {
  experienceService.weeklyXpGain(req.params.id).then((result) => {
    res.status(200).json(result);
  });
});

export default router;
