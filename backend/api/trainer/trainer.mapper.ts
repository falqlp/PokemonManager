import { ITrainer } from "./trainer";
import { IPokemon } from "../pokemon/pokemon";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/pokemon.service";
import TrainerService from "./trainer.service";
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
    trainer.trainingCamp = await this.trainingCampService.get(
      trainer.trainingCamp as unknown as string
    );
    trainer.pcStorage = await this.pcStorageService.get(
      trainer.pcStorage as unknown as string
    );
    return trainer;
  }
  public mapPartial(trainer: ITrainer): ITrainer {
    trainer.pokemons = undefined;
    trainer.pcStorage = undefined;
    trainer.trainingCamp = undefined;
    return trainer;
  }

  public update(trainer: ITrainer): ITrainer {
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
