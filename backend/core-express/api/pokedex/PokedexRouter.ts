import express, { Request, Response } from "express";
import { PokedexService } from "../../application/pokedex/PokedexService";
import { container } from "tsyringe";

const router = express.Router();
const pokedexService = container.resolve<PokedexService>(PokedexService);
router.get("/:id", async (req: Request, res: Response, next) => {
  try {
    res
      .status(200)
      .json(await pokedexService.getPokemonDetails(+req.params.id));
  } catch (error) {
    next(error);
  }
});
export default router;
