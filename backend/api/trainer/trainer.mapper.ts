import { ITrainer } from "./trainer";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/pokemon.service";
import TrainingCampService from "../trainingCamp/trainingCamp.service";
import PcStorageService from "../pcStorage/pcStorage.service";
import { updatePlayer } from "../../websocketServer";
import { ITrainingCamp } from "../trainingCamp/trainingCamp";

class TrainerMapper implements IMapper<ITrainer> {
  private static instance: TrainerMapper;
  constructor(
    protected pokemonService: PokemonService,
    protected trainingCampService: TrainingCampService,
    protected pcStorageService: PcStorageService
  ) {}
  public async map(trainer: ITrainer): Promise<ITrainer> {
    if (trainer) {
      trainer.pokemons = await this.pokemonService.list({
        ids: trainer.pokemons as unknown as string[],
      });
    }
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
    if (!trainer.pokemons) {
      trainer.pokemons = [];
    }
    trainer.pokemons = await Promise.all(
      trainer.pokemons.map(async (pokemon) => {
        pokemon = await this.pokemonService.update(pokemon._id, pokemon);
        return pokemon;
      })
    );
    if (!trainer.pcStorage) {
      trainer.pcStorage = await this.pcStorageService.create(
        undefined,
        trainer.gameId
      );
    }
    if (!trainer.trainingCamp) {
      trainer.trainingCamp = await this.trainingCampService.create(
        { level: 1 } as unknown as ITrainingCamp,
        trainer.gameId
      );
    }

    if (typeof trainer.pcStorage !== "string") {
      await this.pcStorageService.update(
        trainer.pcStorage._id,
        trainer.pcStorage
      );
    }
    if (trainer._id) {
      await updatePlayer(trainer._id, trainer.gameId);
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
