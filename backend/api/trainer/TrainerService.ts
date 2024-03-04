import Trainer, { ITrainer } from "./Trainer";
import CompleteService from "../CompleteService";
import TrainerMapper from "./TrainerMapper";
import { IPokemon } from "../pokemon/Pokemon";
import { Model } from "mongoose";
import PokemonService from "../pokemon/PokemonService";
import PcStorageService from "../pcStorage/PcStorageService";

class TrainerService extends CompleteService<ITrainer> {
  private static instance: TrainerService;

  constructor(
    trainer: Model<ITrainer>,
    protected mapper: TrainerMapper,
    protected pokemonService: PokemonService,
    protected pcStorageService: PcStorageService
  ) {
    super(trainer, mapper);
  }
  public static getInstance(): TrainerService {
    if (!TrainerService.instance) {
      TrainerService.instance = new TrainerService(
        Trainer,
        TrainerMapper.getInstance(),
        PokemonService.getInstance(),
        PcStorageService.getInstance()
      );
    }
    return TrainerService.instance;
  }

  public async getComplete(_id: string): Promise<ITrainer> {
    return this.get(_id, { map: this.mapper.mapComplete });
  }

  public async addPokemonForTrainer(pokemon: IPokemon, trainerId: string) {
    pokemon.trainerId = trainerId;
    await this.pokemonService.update(pokemon._id, pokemon);
    const trainer = await this.getComplete(trainerId);
    if (trainer.pokemons.length < 6) {
      trainer.pokemons.push(pokemon._id);
    } else {
      trainer.pcStorage.maxSize;
      let freeIndex;
      for (let i = 0; i < trainer.pcStorage.maxSize; i++) {
        if (!trainer.pcStorage.storage.find((st) => st.position === i)) {
          trainer.pcStorage.storage.push({ pokemon, position: i });
          freeIndex = true;
          break;
        }
      }
      if (!freeIndex) {
        await this.pokemonService.delete(pokemon._id);
      } else {
        await this.pcStorageService.update(
          trainer.pcStorage._id,
          trainer.pcStorage
        );
      }
    }
    await this.update(trainerId, trainer);
  }
}

export default TrainerService;
