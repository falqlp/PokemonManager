import { ITrainer } from "./trainer";
import { IPokemon } from "../pokemon/pokemon";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/pokemon.service";
import TrainerService from "./trainer.service";

class TrainerMapper implements IMapper<ITrainer> {
  private static instance: TrainerMapper;
  constructor(protected pokemonService: PokemonService) {}
  public async map(trainer: ITrainer): Promise<ITrainer> {
    trainer.pokemons = await this.pokemonService.list({
      ids: trainer.pokemons as unknown as string[],
    });
    return trainer;
  }

  public update(trainer: ITrainer): ITrainer {
    trainer.pokemons = trainer.pokemons.map((pokemon: IPokemon) => pokemon._id);
    return trainer;
  }

  public static getInstance(): TrainerMapper {
    if (!TrainerMapper.instance) {
      TrainerMapper.instance = new TrainerMapper(PokemonService.getInstance());
    }
    return TrainerMapper.instance;
  }
}

export default TrainerMapper;
