import express, { Request, Response } from "express";
import { PokedexService } from "./PokedexService";

const router = express.Router();
const pokedexService = PokedexService.getInstance();
router.get("/:id", async (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .json(await pokedexService.getPokemonDetails(+req.params.id));
  } catch (error) {
    console.log(error);
  }
});
export default router;
