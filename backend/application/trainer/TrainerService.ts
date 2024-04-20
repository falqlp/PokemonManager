import { IPokemon } from "../../api/pokemon/Pokemon";
import PokemonService from "../../api/pokemon/PokemonService";
import PcStorageService from "../../api/pcStorage/PcStorageService";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import TrainerClassRepository from "../../domain/trainerClass/TrainerClassRepository";
import { ITrainer } from "../../domain/trainer/Trainer";
import { RangeModel } from "../RangeModel";
import PokemonUtilsService from "../../api/pokemon/PokemonUtilsService";
import PokemonBaseService from "../pokemonBase/PokemonBaseService";
import MoveLearningService from "../moveLearning/MoveLearningService";
import EvolutionRepository from "../../domain/evolution/EvolutionRepository";

class TrainerService {
  private static instance: TrainerService;

  public static getInstance(): TrainerService {
    if (!TrainerService.instance) {
      TrainerService.instance = new TrainerService(
        PokemonService.getInstance(),
        PcStorageService.getInstance(),
        TrainerRepository.getInstance(),
        TrainerClassRepository.getInstance(),
        PokemonUtilsService.getInstance(),
        PokemonBaseService.getInstance(),
        MoveLearningService.getInstance(),
        EvolutionRepository.getInstance()
      );
    }
    return TrainerService.instance;
  }
  constructor(
    protected pokemonService: PokemonService,
    protected pcStorageService: PcStorageService,
    protected trainerRepository: TrainerRepository,
    protected trainerClassRepository: TrainerClassRepository,
    protected pokemonUtilsService: PokemonUtilsService,
    protected pokemonBaseService: PokemonBaseService,
    protected moveLearningService: MoveLearningService,
    protected evolutionRepository: EvolutionRepository
  ) {}

  public async addPokemonForTrainer(pokemon: IPokemon, trainerId: string) {
    pokemon.trainerId = trainerId;
    await this.pokemonService.update(pokemon._id, pokemon);
    const trainer = await this.trainerRepository.getComplete(trainerId);
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
    await this.trainerRepository.update(trainerId, trainer);
  }

  public async generateTrainer(gameId: string): Promise<ITrainer> {
    const nameAndClass = (
      await this.trainerClassRepository.generateTrainerName()
    )[0];
    const trainer: ITrainer = {
      gameId,
      name: nameAndClass.name,
      class: nameAndClass.class,
    } as ITrainer;
    return this.trainerRepository.create(trainer, gameId);
  }

  public async generateTrainerPokemons(
    gameId: string,
    trainer: ITrainer,
    quantityRange: RangeModel,
    levelRange: RangeModel
  ): Promise<void> {
    const quantity = Math.floor(
      quantityRange.min +
        Math.random() * (quantityRange.max - quantityRange.min + 1)
    );
    const pokemonBases = await this.pokemonBaseService.generateBasePokemon(
      quantity
    );
    for (let basePokemon of pokemonBases) {
      const level = Math.floor(
        levelRange.min + Math.random() * (levelRange.max - levelRange.min + 1)
      );
      const potential = this.pokemonUtilsService.generatePotential(
        trainer.nursery.level
      );
      const hiddenPotential =
        this.pokemonUtilsService.generateHiddenPotential(potential);
      const evolution = await this.evolutionRepository.maxEvolution(
        basePokemon.id,
        level,
        "LEVEL-UP"
      );
      if (evolution) {
        basePokemon = evolution;
      }
      const moves = (
        await this.moveLearningService.learnableMoves(basePokemon.id, level, {
          sort: { power: -1 },
        })
      ).splice(2);
      let pokemon: IPokemon = {
        basePokemon,
        level,
        gameId,
        age: 1,
        potential,
        hiddenPotential,
        moves,
      } as IPokemon;
      pokemon = await this.pokemonService.create(pokemon, gameId);
      await this.addPokemonForTrainer(pokemon, trainer._id);
    }
  }
}

export default TrainerService;
