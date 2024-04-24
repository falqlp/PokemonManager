import express from "express";
import CompleteRouter from "../CompleteRouter";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import CalendarEventService from "../../application/calendarEvent/CalendarEventService";
import CalendarEventMapper from "./CalendarEventMapper";
import BattleInstanceMapper from "../battle-instance/BattleInstanceMapper";
import { container } from "tsyringe";

const router = express.Router();
const calendarEventService = container.resolve(CalendarEventService);
const mapper = container.resolve(CalendarEventMapper);
const battleInstanceMapper = container.resolve(BattleInstanceMapper);
const completeRouter = new CompleteRouter(
  container.resolve(CalendarEventRepository),
  mapper,
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
    .then((result) =>
      res
        .status(200)
        .json(result.map((events) => events.map((event) => mapper.map(event)))),
    )
    .catch((error: Error) => console.log(error));
});
router.post("/simulateDay", (req, res) => {
  const gameId = req.headers["game-id"] as string;
  calendarEventService
    .simulateDay(req.body.trainerId, req.body.date, gameId)
    .then((result) => {
      if (result.battle) {
        result.battle = battleInstanceMapper.map(result.battle);
      }
      res.status(200).json(result);
    })
    .catch((error: Error) => console.log(error));
});

export default router;
