import { ITrainer } from "../../domain/trainer/Trainer";
import { IMapper } from "../../domain/IMapper";
import { ITrainingCamp } from "../../domain/trainingCamp/TrainingCamp";
import PokemonMapper from "../pokemon/PokemonMapper";
import { IPcStorage } from "../../domain/pcStorage/PcStorage";
import { INursery } from "../../domain/nursery/Nursery";

class TrainerMapper implements IMapper<ITrainer> {
  private static instance: TrainerMapper;

  constructor(protected pokemonMapper: PokemonMapper) {}

  public map(trainer: ITrainer): ITrainer {
    trainer = this.mapPlayer(trainer);
    trainer.berries = undefined;
    trainer.monney = undefined;
    return trainer;
  }

  public mapPlayer = (trainer: ITrainer): ITrainer => {
    trainer.pokemons?.map((pokemon) => this.pokemonMapper.map(pokemon));
    if (trainer.pcStorage?._id) {
      trainer.pcStorage = trainer.pcStorage._id as unknown as IPcStorage;
    }
    if (trainer.trainingCamp?._id) {
      trainer.trainingCamp = trainer.trainingCamp
        ._id as unknown as ITrainingCamp;
    }
    if (trainer.nursery?._id) {
      trainer.nursery = trainer.nursery._id as unknown as INursery;
    }
    return trainer;
  };

  public mapPartial = (trainer: ITrainer): ITrainer => {
    this.map(trainer);
    trainer.pokemons = undefined;
    return trainer;
  };

  public static getInstance(): TrainerMapper {
    if (!TrainerMapper.instance) {
      TrainerMapper.instance = new TrainerMapper(PokemonMapper.getInstance());
    }
    return TrainerMapper.instance;
  }
}

export default TrainerMapper;
