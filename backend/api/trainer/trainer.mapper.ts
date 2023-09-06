import pokemonService from "../pokemon/pokemon.service";
import { ITrainer } from "./trainer";
import { IPokemon } from "../pokemon/pokemon";

const TrainerMapper = {
  map: async function (trainer: ITrainer): Promise<ITrainer> {
    trainer.pokemons = await pokemonService.list({ ids: trainer.pokemons });
    return trainer;
  },

  update: function (trainer: ITrainer): ITrainer {
    trainer.pokemons = trainer.pokemons.map((pokemon: IPokemon) => pokemon._id);
    return trainer;
  },
};

export default TrainerMapper;
