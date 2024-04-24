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
router.post("/battle", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    const obj = await calendarEventService.createBattleEvent(
      req.body.date,
      req.body.trainers,
      gameId,
    );
    res.status(200).json(mapper.map(obj));
  } catch (error) {
    next(error);
  }
});

router.post("/weekCalendar", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    const obj = await calendarEventService.getWeekCalendar(
      req.body.trainerId,
      req.body.date,
      gameId,
    );
    res
      .status(200)
      .json(obj.map((events) => events.map((event) => mapper.map(event))));
  } catch (error) {
    next(error);
  }
});

router.post("/simulateDay", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    const obj = await calendarEventService.simulateDay(
      req.body.trainerId,
      req.body.date,
      gameId,
    );
    if (obj.battle) {
      obj.battle = battleInstanceMapper.map(obj.battle);
    }
    res.status(200).json(obj);
  } catch (error) {
    next(error);
  }
});

export default router;
