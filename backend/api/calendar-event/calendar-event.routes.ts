import express from "express";
import CompleteRouter from "../CompleteRouter";
import CalendarEventService from "./calendar-event.service";

const router = express.Router();
const service = CalendarEventService.getInstance();
const completeRouter = new CompleteRouter(service);

router.use("/", completeRouter.router);
router.post("/battle", (req, res, next) => {
  const partyId = req.headers["party-id"] as string;
  return service.createBattleEvent(req.body.date, req.body.trainers, partyId);
});
router.post("/weekCalendar", (req, res, next) => {
  const partyId = req.headers["party-id"] as string;
  service
    .getWeekCalendar(req.body.trainerId, req.body.date, partyId)
    .then((result) => res.status(200).json(result))
    .catch((error: any) => console.log(error));
});
router.post("/simulateDay", (req, res, next) => {
  const partyId = req.headers["party-id"] as string;
  service
    .simulateDay(req.body.trainerId, req.body.date, partyId)
    .then((result) => res.status(200).json(result))
    .catch((error: any) => console.log(error));
});

export default router;
