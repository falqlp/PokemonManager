import { IPokemon } from "../../domain/pokemon/Pokemon";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import PcStorageRepository from "../../domain/trainer/pcStorage/PcStorageRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerClassRepository from "../../domain/trainer/trainerClass/TrainerClassRepository";
import { ITrainer } from "../../domain/trainer/Trainer";
import { RangeModel } from "../../models/RangeModel";
import PokemonUtilsService from "../pokemon/PokemonUtilsService";
import PokemonBaseService from "../pokemon/pokemonBase/PokemonBaseService";
import MoveLearningService from "../moveLearning/MoveLearningService";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";
import PokemonService from "../pokemon/PokemonService";
import TrainingCampRepository from "../../domain/trainer/trainingCamp/TrainingCampRepository";
import NurseryRepository from "../../domain/trainer/nursery/NurseryRepository";
import { singleton } from "tsyringe";
import { ICompetition } from "../../domain/competiton/Competition";
import { IPcStorage } from "../../domain/trainer/pcStorage/PcStorage";
import { INursery } from "../../domain/trainer/nursery/Nursery";
import { ITrainingCamp } from "../../domain/trainer/trainingCamp/TrainingCamp";
import { Gender } from "../../domain/Gender";
import { IGame } from "../../domain/game/Game";
import { addYears } from "../../utils/DateUtils";
import { PcStorageService } from "./pcStorage/PcStorageService";
import { XP_PER_LEVEL } from "../experience/ExperienceService";
import { mongoId } from "../../utils/MongoUtils";
import WebsocketUtils from "../../websocket/WebsocketUtils";

@singleton()
class TrainerService {
  constructor(
    protected pokemonRepository: PokemonRepository,
    protected pcStorageService: PcStorageService,
    protected trainerRepository: TrainerRepository,
    protected trainerClassRepository: TrainerClassRepository,
    protected pokemonUtilsService: PokemonUtilsService,
    protected pokemonBaseService: PokemonBaseService,
    protected moveLearningService: MoveLearningService,
    protected evolutionRepository: EvolutionRepository,
    protected pokemonService: PokemonService,
    protected trainingCampRepository: TrainingCampRepository,
    protected nurseryRepository: NurseryRepository,
    protected pcStorageRepository: PcStorageRepository,
    protected websocketUtils: WebsocketUtils,
  ) {}

  public async addPokemonForTrainer(
    pokemon: IPokemon,
    trainerId: string,
  ): Promise<void> {
    pokemon.trainerId = trainerId;
    await this.pokemonRepository.update(pokemon._id, pokemon);
    const trainer = await this.trainerRepository.get(trainerId);
    if (trainer.pokemons.length < 6) {
      trainer.pokemons.push(pokemon);
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
        await this.pokemonRepository.delete(pokemon._id);
      } else {
        await this.pcStorageService.update(trainer.pcStorage);
      }
    }
    await this.update(trainer);
  }

  public async generateTrainers(
    gameId: string,
    quantity: number,
    championship?: ICompetition,
  ): Promise<ITrainer[]> {
    const trainers: ITrainer[] = [];
    for (let i = 1; i <= quantity; i++) {
      const nameAndClass = (
        await this.trainerClassRepository.generateTrainerName()
      )[0];
      const trainer: ITrainer = {
        _id: mongoId(),
        gameId,
        name: nameAndClass.name,
        class: nameAndClass.class,
        competitions: championship ? [championship] : [],
        pokemons: [],
      } as ITrainer;
      trainers.push(trainer);
    }
    return trainers;
  }

  public async generateTrainersPokemons(
    game: IGame,
    trainers: ITrainer[],
    quantityRange: RangeModel,
    levelRange: RangeModel,
  ): Promise<{ pokemons: IPokemon[]; trainers: ITrainer[] }> {
    const pokemons: IPokemon[] = [];
    for (const trainer of trainers) {
      const quantity = Math.floor(
        quantityRange.min +
          Math.random() * (quantityRange.max - quantityRange.min + 1),
      );
      const pokemonBases =
        await this.pokemonBaseService.generateBasePokemon(quantity);
      for (let basePokemon of pokemonBases) {
        const level = Math.floor(
          levelRange.min +
            Math.random() * (levelRange.max - levelRange.min + 1),
        );
        const potential = Math.max(
          this.pokemonUtilsService.generatePotential(1),
          level,
        );
        const hiddenPotential =
          this.pokemonUtilsService.generateHiddenPotential(potential);
        const evolution = await this.evolutionRepository.maxEvolution(
          basePokemon.id,
          level,
          "LEVEL-UP",
        );
        if (evolution) {
          basePokemon = evolution;
        }
        const moves = (
          await this.moveLearningService.learnableMoves(basePokemon.id, level, {
            sort: { power: -1 },
          })
        ).slice(0, 2);
        const strategy: number[] = [];
        moves.forEach(() => {
          strategy.push(9);
        });
        const birthday = addYears(
          game.actualDate,
          -(1 + Math.floor(Math.random() * 8)),
        );
        const pokemon: IPokemon = {
          _id: mongoId(),
          trainerId: trainer._id.toString(),
          basePokemon,
          level,
          gameId: game._id.toString(),
          birthday,
          potential,
          hiddenPotential,
          moves,
          strategy,
          happiness: basePokemon.baseHappiness,
          exp: Math.floor(Math.random() * XP_PER_LEVEL),
          iv: this.pokemonUtilsService.generateIvs(),
          ev: this.pokemonUtilsService.initEvs(),
          trainingPercentage: 0,
          maxLevel: level,
          nature: this.pokemonUtilsService.getRandomNature(),
          gender: basePokemon.genderRate
            ? Math.random() < basePokemon.genderRate / 100
              ? Gender.FEMALE
              : Gender.MALE
            : Gender.NONE,
        } as IPokemon;
        pokemon.stats = this.pokemonUtilsService.updateStats(pokemon);
        trainer.pokemons.push(pokemon);
        pokemons.push(pokemon);
      }
    }
    return {
      pokemons,
      trainers,
    };
  }

  public async generateTrainerWithPokemon(
    game: IGame,
    nbGeneratedTrainer: number,
    championship?: ICompetition,
  ): Promise<void> {
    const generatedTrainers = await this.generateTrainers(
      game._id.toString(),
      nbGeneratedTrainer,
      championship,
    );
    const res = await this.generateTrainersPokemons(
      game,
      generatedTrainers,
      { max: 4, min: 2 },
      { max: 13, min: 8 },
    );
    await this.pokemonService.createPokemons(res.pokemons, game._id);
    await this.createMany(res.trainers);
  }

  public async update(trainer: ITrainer): Promise<ITrainer> {
    await this.updateBase(trainer);
    return this.trainerRepository.update(trainer._id, trainer);
  }

  public async updateBase(trainer: ITrainer): Promise<ITrainer> {
    trainer.pokemons = await this.pokemonService.updateMany(
      trainer.pokemons,
      trainer.gameId,
    );

    if (typeof trainer.pcStorage !== "string") {
      await this.pcStorageService.update(trainer.pcStorage);
    }
    setTimeout(async () => {
      await this.websocketUtils.updatePlayer(
        trainer._id.toString(),
        trainer.gameId,
      );
    }, 200);
    return trainer;
  }

  public async updateMany(trainers: ITrainer[]): Promise<ITrainer[]> {
    for (let trainer of trainers) {
      trainer = await this.updateBase(trainer);
    }
    return this.trainerRepository.updateMany(trainers);
  }

  public async create(trainer: ITrainer): Promise<ITrainer> {
    if (!trainer.pokemons) {
      trainer.pokemons = [];
    }
    const gameId = trainer.gameId;
    if (!trainer.competitions) {
      trainer.competitions = [];
    }
    if (!trainer.pcStorage) {
      trainer.pcStorage = await this.pcStorageRepository.create({
        gameId,
        maxSize: 4,
        storage: [],
      });
    }
    if (!trainer.nursery) {
      trainer.nursery = await this.nurseryRepository.create({
        gameId,
        level: 1,
        eggs: [],
        step: "WISHLIST",
      });
    }
    if (!trainer.trainingCamp) {
      trainer.trainingCamp = await this.trainingCampRepository.create({
        level: 1,
        gameId,
      });
    }
    if (!trainer.monney) {
      trainer.monney = 0;
    }
    if (!trainer.berries) {
      trainer.berries = 0;
    }
    return this.trainerRepository.create(trainer);
  }

  public async createMany(trainers: ITrainer[]): Promise<ITrainer[]> {
    const pcStorages: IPcStorage[] = [];
    const nurseries: INursery[] = [];
    const trainingCamps: ITrainingCamp[] = [];
    for (const trainer of trainers) {
      if (!trainer.pokemons) {
        trainer.pokemons = [];
      }
      const gameId = trainer.gameId;
      if (!trainer.competitions) {
        trainer.competitions = [];
      }
      if (!trainer.pcStorage) {
        const newPcStorage: IPcStorage = {
          gameId,
          maxSize: 0,
          storage: [],
          _id: mongoId(),
        };
        trainer.pcStorage = newPcStorage;
        pcStorages.push(newPcStorage);
      }
      if (!trainer.nursery) {
        const newNursery: INursery = {
          gameId,
          level: 1,
          eggs: [],
          step: "WISHLIST",
          _id: mongoId(),
        };
        trainer.nursery = newNursery;
        nurseries.push(newNursery);
      }
      if (!trainer.trainingCamp) {
        const newTrainingCamp: ITrainingCamp = {
          level: 1,
          gameId,
          _id: mongoId(),
        };
        trainer.trainingCamp = newTrainingCamp;
        trainingCamps.push(newTrainingCamp);
      }
      if (!trainer.monney) {
        trainer.monney = 0;
      }
      if (!trainer.berries) {
        trainer.berries = 0;
      }
    }
    await this.pcStorageRepository.insertMany(pcStorages);
    await this.nurseryRepository.insertMany(nurseries);
    await this.trainingCampRepository.insertMany(trainingCamps);
    return await this.trainerRepository.insertMany(trainers);
  }
}

export default TrainerService;
