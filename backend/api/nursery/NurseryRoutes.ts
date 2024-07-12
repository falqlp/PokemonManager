import express from "express";
import CompleteRouter from "../CompleteRouter";
import NurseryRepository from "../../domain/trainer/nursery/NurseryRepository";
import NurseryMapper from "./NurseryMapper";
import { container } from "tsyringe";
import NurseryService from "../../application/trainer/nursery/NurseryService";

const router = express.Router();
const service = container.resolve(NurseryService);
const repository = container.resolve(NurseryRepository);
const completeRouter = new CompleteRouter(
  repository,
  container.resolve(NurseryMapper),
);

router.post("/setNurseryWishlist", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    await service.setNurseryWishlist(
      req.body.nurseryId,
      req.body.wishlist,
      gameId,
      req.body.trainerId,
    );
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.use("/", completeRouter.router);

export default router;
