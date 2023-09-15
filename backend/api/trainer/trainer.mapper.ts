import { ITrainer } from "./trainer";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/pokemon.service";
import TrainingCampService from "../trainingCamp/trainingCamp.service";
import PcStorageService from "../pcStorage/pcStorage.service";

class TrainerMapper implements IMapper<ITrainer> {
  private static instance: TrainerMapper;
  constructor(
    protected pokemonService: PokemonService,
    protected trainingCampService: TrainingCampService,
    protected pcStorageService: PcStorageService
  ) {}
  public async map(trainer: ITrainer): Promise<ITrainer> {
    trainer.pokemons = await this.pokemonService.list({
      ids: trainer.pokemons as unknown as string[],
    });
    return trainer;
  }
  public mapPartial = (trainer: ITrainer): ITrainer => {
    trainer.pokemons = undefined;
    trainer.pcStorage = undefined;
    trainer.trainingCamp = undefined;
    return trainer;
  };
  public mapComplete = async (trainer: ITrainer): Promise<ITrainer> => {
    trainer.pokemons = await this.pokemonService.listComplete({
      ids: trainer.pokemons as unknown as string[],
    });
    trainer.trainingCamp = await this.trainingCampService.get(
      trainer.trainingCamp as unknown as string
    );
    trainer.pcStorage = await this.pcStorageService.get(
      trainer.pcStorage as unknown as string
    );
    return trainer;
  };

  public async update(trainer: ITrainer): Promise<ITrainer> {
    trainer.pokemons.map(async (pokemon) => {
      console.log(pokemon.exp);
      pokemon = await this.pokemonService.update(pokemon._id, pokemon);
      console.log(pokemon.exp);
      return pokemon;
    });
    if (typeof trainer.pcStorage !== "string") {
      await this.pcStorageService.update(
        trainer.pcStorage._id,
        trainer.pcStorage
      );
    }
    return trainer;
  }

  public static getInstance(): TrainerMapper {
    if (!TrainerMapper.instance) {
      TrainerMapper.instance = new TrainerMapper(
        PokemonService.getInstance(),
        TrainingCampService.getInstance(),
        PcStorageService.getInstance()
      );
    }
    return TrainerMapper.instance;
  }
}

export default TrainerMapper;
