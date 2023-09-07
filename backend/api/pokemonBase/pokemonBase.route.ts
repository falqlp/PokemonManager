import express, { Router, Request, Response, NextFunction } from "express";
import PokemonBase from "./pokemonBase";
import pokemonBaseService from "./pokemonBase.service";
import ReadOnlyRouter from "../ReadOnlyRouter";
import PokemonBaseService from "./pokemonBase.service";

const router: Router = express.Router();
const readOnlyRouter = new ReadOnlyRouter(PokemonBaseService.getInstance());

router.use("/", readOnlyRouter.router);

router.get(
  "/search/:name",
  (req: Request, res: Response, next: NextFunction) => {
    if (req.params.name) {
      const regex = new RegExp("^" + req.params.name, "i");
      PokemonBase.find({ name: regex })
        .sort({ id: 1 })
        .limit(5)
        .then((pokemons) => res.status(200).json(pokemons))
        .catch((error) => console.log(error));
    } else {
      res.status(200).json([]);
    }
  }
);

export default router;
