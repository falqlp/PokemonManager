import express from "express";
import NurseryRepository from "../../domain/trainer/nursery/NurseryRepository";
import NurseryMapper from "./NurseryMapper";
import { container } from "tsyringe";
import NurseryService from "../../application/trainer/nursery/NurseryService";
import ReadOnlyRouter from "../ReadOnlyRouter";

const router = express.Router();
const service = container.resolve(NurseryService);
const repository = container.resolve(NurseryRepository);
const readOnlyRouter = new ReadOnlyRouter(
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

router.put("/saveNurseryWishlist", async (req, res, next) => {
  try {
    const gameId = req.headers["game-id"] as string;
    await service.saveNurseryWishlist(
      req.body.nurseryId,
      req.body.wishlist,
      gameId,
    );
    res.status(200).json();
  } catch (error: unknown) {
    next(error);
  }
});

router.use("/", readOnlyRouter.router);

export default router;
