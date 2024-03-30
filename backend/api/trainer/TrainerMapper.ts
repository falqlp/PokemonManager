import trainer, { ITrainer } from "./Trainer";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/PokemonService";
import TrainingCampService from "../trainingCamp/TrainingCampService";
import PcStorageService from "../pcStorage/PcStorageService";
import { updatePlayer } from "../../websocketServer";
import TrainingCamp, { ITrainingCamp } from "../trainingCamp/TrainingCamp";
import NurseryService from "../nursery/NurseryService";
import { PopulateOptions } from "mongoose";
import Pokemon from "../pokemon/Pokemon";
import PokemonMapper from "../pokemon/PokemonMapper";
import PcStorage from "../pcStorage/PcStorage";
import PcStorageMapper from "../pcStorage/PcStorageMapper";
import TrainingCampMapper from "../trainingCamp/TrainingCampMapper";
import Nursery from "../nursery/Nursery";
import NurseryMapper from "../nursery/NurseryMapper";

class TrainerMapper implements IMapper<ITrainer> {
  private static instance: TrainerMapper;

  constructor(
    protected pokemonService: PokemonService,
    protected trainingCampService: TrainingCampService,
    protected pcStorageService: PcStorageService,
    protected nurseryService: NurseryService,
    protected pokemonMapper: PokemonMapper,
    protected pcStorageMapper: PcStorageMapper,
    protected trainingCampMapper: TrainingCampMapper,
    protected nurseryMapper: NurseryMapper
  ) {}

  public populate(): PopulateOptions[] {
    return [
      {
        path: "pokemons",
        model: Pokemon,
        populate: this.pokemonMapper.populate(),
      },
      {
        path: "pcStorage",
        model: PcStorage,
        populate: this.pcStorageMapper.populate(),
      },
      {
        path: "trainingCamp",
        model: TrainingCamp,
        populate: this.trainingCampMapper.populate(),
      },
      {
        path: "nursery",
        model: Nursery,
        populate: this.nurseryMapper.populate(),
      },
    ];
  }
  public map(trainer: ITrainer): ITrainer {
    trainer = this.mapPlayer(trainer);
    trainer.berries = undefined;
    trainer.monney = undefined;
    return trainer;
  }

  public mapPlayer = (trainer: ITrainer): ITrainer => {
    trainer.pokemons?.map((pokemon) => this.pokemonMapper.map(pokemon));
    if (trainer.pcStorage?._id) {
      trainer.pcStorage = trainer.pcStorage._id;
    }
    if (trainer.trainingCamp?._id) {
      trainer.trainingCamp = trainer.trainingCamp._id;
    }
    if (trainer.nursery?._id) {
      trainer.nursery = trainer.nursery._id;
    }
    return trainer;
  };
  public mapPartial = (trainer: ITrainer): ITrainer => {
    this.map(trainer);
    trainer.pokemons = undefined;
    return trainer;
  };
  public mapComplete = (trainer: ITrainer): ITrainer => {
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
    if (!trainer.nursery) {
      trainer.nursery = await this.nurseryService.create(
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
    if (!trainer.monney) {
      trainer.monney = 0;
    }
    if (!trainer.berries) {
      trainer.berries = 0;
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
        PcStorageService.getInstance(),
        NurseryService.getInstance(),
        PokemonMapper.getInstance(),
        PcStorageMapper.getInstance(),
        TrainingCampMapper.getInstance(),
        NurseryMapper.getInstance()
      );
    }
    return TrainerMapper.instance;
  }
}

export default TrainerMapper;
