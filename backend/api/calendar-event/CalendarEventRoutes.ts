import express from "express";
import CompleteRouter from "../CompleteRouter";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import CalendarEventService from "../../application/calendarEvent/CalendarEventService";

const router = express.Router();
const calendarEventService = CalendarEventService.getInstance();
const completeRouter = new CompleteRouter(
  CalendarEventRepository.getInstance(),
);

router.use("/", completeRouter.router);
router.post("/battle", (req) => {
  const gameId = req.headers["game-id"] as string;
  return calendarEventService.createBattleEvent(
    req.body.date,
    req.body.trainers,
    gameId,
  );
});
router.post("/weekCalendar", (req, res) => {
  const gameId = req.headers["game-id"] as string;
  calendarEventService
    .getWeekCalendar(req.body.trainerId, req.body.date, gameId)
    .then((result) => res.status(200).json(result))
    .catch((error: any) => console.log(error));
});
router.post("/simulateDay", (req, res) => {
  const gameId = req.headers["game-id"] as string;
  calendarEventService
    .simulateDay(req.body.trainerId, req.body.date, gameId)
    .then((result) => res.status(200).json(result))
    .catch((error: any) => console.log(error));
});

export default router;
