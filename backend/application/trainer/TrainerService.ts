import { IPokemon } from "../../domain/pokemon/Pokemon";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import PcStorageService from "../../domain/pcStorage/PcStorageRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerClassRepository from "../../domain/trainerClass/TrainerClassRepository";
import { ITrainer } from "../../domain/trainer/Trainer";
import { RangeModel } from "../RangeModel";
import PokemonUtilsService from "../pokemon/PokemonUtilsService";
import PokemonBaseService from "../pokemonBase/PokemonBaseService";
import MoveLearningService from "../moveLearning/MoveLearningService";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";
import PokemonService from "../pokemon/PokemonService";
import TrainingCampRepository from "../../domain/trainingCamp/TrainingCampRepository";
import NurseryRepository from "../../domain/nursery/NurseryRepository";
import { singleton } from "tsyringe";
import { ICompetition } from "../../domain/competiton/Competition";
import { ObjectId } from "mongodb";
import { IPcStorage } from "../../domain/pcStorage/PcStorage";
import { INursery } from "../../domain/nursery/Nursery";
import { ITrainingCamp } from "../../domain/trainingCamp/TrainingCamp";
import PcStorageRepository from "../../domain/pcStorage/PcStorageRepository";

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
        await this.pcStorageService.update(
          trainer.pcStorage._id,
          trainer.pcStorage,
        );
      }
    }
    await this.update(trainer);
  }

  public async generateTrainers(
    gameId: string,
    championship: ICompetition,
    quantity: number,
  ): Promise<ITrainer[]> {
    const trainers: ITrainer[] = [];
    for (let i = 1; i <= quantity; i++) {
      const nameAndClass = (
        await this.trainerClassRepository.generateTrainerName()
      )[0];
      const trainer: ITrainer = {
        _id: new ObjectId() as unknown as string,
        gameId,
        name: nameAndClass.name,
        class: nameAndClass.class,
        competitions: [championship],
        pokemons: [],
      } as ITrainer;
      trainers.push(trainer);
    }
    return trainers;
  }

  public async generateTrainersPokemons(
    gameId: string,
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
        const potential = this.pokemonUtilsService.generatePotential(1);
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
        const pokemon: IPokemon = {
          _id: new ObjectId() as unknown as string,
          trainerId: trainer._id.toString(),
          basePokemon,
          level,
          gameId,
          age: 0,
          potential,
          hiddenPotential,
          moves,
          happiness: basePokemon.baseHappiness,
          exp: 0,
          iv: this.pokemonUtilsService.generateIvs(),
          ev: this.pokemonUtilsService.initEvs(),
          trainingPercentage: 0,
          maxLevel: level,
          nature: this.pokemonUtilsService.getRandomNature(),
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

  public async update(trainer: ITrainer): Promise<ITrainer> {
    trainer.pokemons = await Promise.all(
      trainer.pokemons.map(async (pokemon) => {
        pokemon = await this.pokemonService.update(pokemon._id, pokemon);
        return pokemon;
      }),
    );

    if (typeof trainer.pcStorage !== "string") {
      await this.pcStorageService.update(
        trainer.pcStorage._id,
        trainer.pcStorage,
      );
    }
    return this.trainerRepository.update(trainer._id, trainer);
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
      trainer.pcStorage = await this.pcStorageService.create({
        gameId,
        maxSize: 0,
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
          _id: new ObjectId() as unknown as string,
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
          _id: new ObjectId() as unknown as string,
        };
        trainer.nursery = newNursery;
        nurseries.push(newNursery);
      }
      if (!trainer.trainingCamp) {
        const newTrainingCamp: ITrainingCamp = {
          level: 1,
          gameId,
          _id: new ObjectId() as unknown as string,
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
