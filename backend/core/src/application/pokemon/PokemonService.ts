import PokemonRepository from '../../domain/pokemon/PokemonRepository';
import TrainerRepository from '../../domain/trainer/TrainerRepository';
import PokemonUtilsService from './PokemonUtilsService';
import { INursery } from '../../domain/trainer/nursery/Nursery';
import PokemonBaseService from './pokemonBase/PokemonBaseService';
import PokemonBaseRepository from '../../domain/pokemon/pokemonBase/PokemonBaseRepository';
import GameRepository from '../../domain/game/GameRepository';
import { Injectable } from '@nestjs/common';
import MoveLearningService from '../moveLearning/MoveLearningService';
import { addYears } from 'shared/utils/DateUtils';
import EvolutionRepository from '../../domain/evolution/EvolutionRepository';
import WebsocketUtils from '../../websocket/WebsocketUtils';
import { IPokemon, PokemonNature } from 'shared/models/pokemon/pokemon-models';
import { Gender } from 'shared/models/utils/utils-models';
import { IMove } from 'shared/models/move/mode-model';

@Injectable()
class PokemonService {
  constructor(
    private pokemonRepository: PokemonRepository,
    private trainerRepository: TrainerRepository,
    private pokemonUtilsService: PokemonUtilsService,
    private pokemonBaseService: PokemonBaseService,
    private pokemonBaseRepository: PokemonBaseRepository,
    private gameRepository: GameRepository,
    private websocketUtils: WebsocketUtils,
    private moveLearningService: MoveLearningService,
    private evolutionRepository: EvolutionRepository,
  ) {}

  public async update(_id: string, pokemon: IPokemon): Promise<IPokemon> {
    const oldPokemon = await this.pokemonRepository.get(_id);
    const actualDate = (await this.gameRepository.get(pokemon.gameId))
      .actualDate;
    this.updateBase(pokemon, oldPokemon, actualDate);
    if (pokemon.level === 1 && pokemon.level !== oldPokemon.level) {
      await this.pokemonRepository.findOneAndUpdate(
        { _id },
        { $set: { hatchingDate: null } },
      );
      pokemon.hatchingDate = null;
    }
    await this.websocketUtils.updatePlayer(
      pokemon.trainerId ?? oldPokemon.trainerId,
      pokemon.gameId,
    );
    return this.pokemonRepository.update(_id, pokemon);
  }

  public async updateMany(
    pokemons: IPokemon[],
    gameId: string,
  ): Promise<IPokemon[]> {
    const actualDate = (await this.gameRepository.get(gameId)).actualDate;
    const oldPokemons = await this.pokemonRepository.list({
      ids: pokemons.map((pokemon) => pokemon._id),
    });
    for (let i = 0; i < pokemons.length; i++) {
      this.updateBase(pokemons.at(i), oldPokemons.at(i), actualDate);
    }
    return this.pokemonRepository.updateManyDtos(pokemons);
  }

  public updateBase(
    pokemon: IPokemon,
    oldPokemon: IPokemon,
    actualDate: Date,
  ): IPokemon {
    pokemon.ev = pokemon.ev ?? oldPokemon.ev;
    pokemon.iv = pokemon.iv ?? oldPokemon.iv;
    pokemon.strategy = pokemon.strategy ?? oldPokemon.strategy;
    pokemon.basePokemon = pokemon.basePokemon ?? oldPokemon.basePokemon;
    pokemon.nature = pokemon.nature ?? oldPokemon.nature ?? PokemonNature.HARDY;
    pokemon.stats = this.pokemonUtilsService.updateStats(pokemon);
    pokemon.birthday = pokemon.birthday ?? oldPokemon.birthday;
    pokemon.strategy = pokemon.strategy ?? oldPokemon.strategy;
    pokemon.moves = pokemon.moves ?? oldPokemon.moves;
    if (!pokemon.strategy) {
      pokemon.strategy = [];
      pokemon.moves.forEach(() => {
        pokemon.strategy.push(9);
      });
    }
    pokemon.maxLevel = Math.max(
      pokemon.level ?? oldPokemon.level,
      pokemon.maxLevel ?? oldPokemon.maxLevel,
    );
    if (!pokemon.birthday) {
      pokemon.birthday = actualDate;
    }
    return pokemon;
  }

  public async create(pokemon: IPokemon, gameId: string): Promise<IPokemon> {
    let newPokemon: IPokemon;
    const actualDate = (await this.gameRepository.get(gameId)).actualDate;
    if (pokemon.level === 0) {
      newPokemon = this.createEgg(pokemon, gameId, actualDate);
    } else {
      newPokemon = this.createPokemon(pokemon, gameId, actualDate);
    }
    newPokemon.shiny =
      pokemon.shiny ?? this.pokemonUtilsService.generateShiny();
    return this.savePokemon(newPokemon, gameId);
  }

  public createPokemon(
    pokemon: IPokemon,
    gameId: string,
    actualDate: Date,
  ): IPokemon {
    pokemon.gameId = gameId;

    if (pokemon.nickname === '') {
      pokemon.nickname = null;
    }
    if (!pokemon.happiness) {
      pokemon.happiness = pokemon.basePokemon.baseHappiness;
    }
    if (!pokemon.gender) {
      if (pokemon.basePokemon.genderRate) {
        pokemon.gender =
          Math.random() < pokemon.basePokemon.genderRate / 100
            ? Gender.FEMALE
            : Gender.MALE;
      } else {
        pokemon.gender = Gender.NONE;
      }
    }
    if (pokemon.exp === undefined) {
      pokemon.exp = 0;
    }
    if (pokemon.iv === undefined) {
      pokemon.iv = this.pokemonUtilsService.generateIvs();
    }
    if (pokemon.ev === undefined) {
      pokemon.ev = this.pokemonUtilsService.initEvs();
    }
    if (!pokemon.nature) {
      pokemon.nature = this.pokemonUtilsService.getRandomNature();
    }
    if (pokemon.trainingPercentage === undefined) {
      pokemon.trainingPercentage = 0;
    }
    if (!pokemon.birthday) {
      pokemon.birthday = new Date(actualDate);
    }
    if (!pokemon.potential) {
      pokemon.potential = 100;
    }
    if (!pokemon.hiddenPotential) {
      pokemon.hiddenPotential =
        this.pokemonUtilsService.generateHiddenPotential(pokemon.potential);
    }
    if (!pokemon.strategy) {
      pokemon.strategy = [];
    }
    if (!pokemon.strategy) {
      const strategy: number[] = [];
      pokemon.moves.forEach(() => {
        strategy.push(9);
      });
      pokemon.strategy = strategy;
    }
    pokemon.stats = this.pokemonUtilsService.updateStats(pokemon);
    pokemon.maxLevel = pokemon.level;
    return pokemon;
  }

  public createEgg(
    pokemon: IPokemon,
    gameId: string,
    actualDate: Date,
  ): IPokemon {
    pokemon = this.createPokemon(pokemon, gameId, actualDate);
    pokemon.hatchingDate = pokemon.birthday;
    pokemon.hatchingDate.setUTCMonth(pokemon.birthday.getUTCMonth() + 3);
    pokemon.birthday = undefined;
    return pokemon;
  }

  public async savePokemon(
    newPokemon: IPokemon,
    gameId: string,
  ): Promise<IPokemon> {
    newPokemon.gameId = gameId;
    const createdPokemon = await this.pokemonRepository.create(newPokemon);
    if (createdPokemon.trainerId) {
      await this.websocketUtils.updatePlayer(
        newPokemon.trainerId,
        newPokemon.gameId,
      );
      this.trainerRepository
        .findOneAndUpdate(
          { _id: createdPokemon.trainerId },
          { $push: { pokemons: createdPokemon._id } },
        )
        .then();
    }
    return createdPokemon;
  }

  public async isHatched(actualDate: Date, gameId: string): Promise<void> {
    const hatched = await this.pokemonRepository.list(
      { custom: { hatchingDate: { $lte: actualDate } } },
      { gameId },
    );
    hatched.forEach((egg) => {
      this.websocketUtils.eggHatched(egg);
    });
  }

  public async generateEgg(
    nursery: INursery,
    gameId: string,
  ): Promise<IPokemon> {
    const potential = this.pokemonUtilsService.generatePotential(nursery.level);
    const egg = {
      basePokemon: await this.pokemonBaseService.generateEggBase(
        nursery.wishList,
      ),
      level: 0,
      potential,
    };
    return this.create(egg as IPokemon, gameId);
  }

  public async generateStarters(
    gameId: string,
    trainerId: string,
  ): Promise<IPokemon[]> {
    const level = 10;
    const actualDate: Date = (await this.gameRepository.get(gameId)).actualDate;
    const birthday = addYears(actualDate, -1);
    const pokemonBases =
      await this.pokemonBaseRepository.getStartersBase(trainerId);
    const starters: IPokemon[] = [];
    for (let base of pokemonBases) {
      const evolution = await this.evolutionRepository.maxEvolution(
        base.id,
        level,
        'LEVEL-UP',
      );
      if (evolution) {
        base = evolution;
      }
      const starter: IPokemon = {
        basePokemon: base,
        level,
        potential: 30,
        exp: 0,
        iv: this.pokemonUtilsService.generateIvs(),
        ev: this.pokemonUtilsService.initEvs(),
        happiness: base.baseHappiness,
        gameId,
        moves: (
          await this.moveLearningService.learnableMoves(base.id, level, {
            sort: { power: -1 },
          })
        ).slice(0, 2),
        trainerId: null,
        nickname: null,
        shiny: this.pokemonUtilsService.generateShiny(),
        birthday,
        hatchingDate: null,
        trainingPercentage: 0,
        maxLevel: level,
      } as IPokemon;
      starters.push(starter);
    }
    return starters;
  }

  public async createPokemons(
    pokemons: IPokemon[],
    gameId: string,
  ): Promise<IPokemon[]> {
    const actualDate = (await this.gameRepository.get(gameId)).actualDate;
    for (const pokemon of pokemons) {
      this.createPokemon(pokemon, gameId, actualDate);
    }
    return await this.pokemonRepository.insertMany(pokemons);
  }

  public async changeNickname(
    pokemonId: string,
    nickname: string,
    gameId: string,
  ): Promise<void> {
    const pokemon = await this.pokemonRepository.get(pokemonId, { gameId });
    if (pokemon) {
      pokemon.nickname = nickname;
      await this.update(pokemonId, pokemon);
    }
  }

  public async modifyMoves(
    pokemonId: string,
    movesId: string[],
    trainerId: string,
    gameId: string,
  ): Promise<void> {
    const pokemon = await this.pokemonRepository.get(pokemonId, { gameId });
    if (pokemon && pokemon.trainerId.toString() === trainerId) {
      const allMoves = await this.moveLearningService.getMovesOfAllEvolutions(
        pokemon.basePokemon.id,
        pokemon.level,
      );
      if (
        movesId.every((id) =>
          allMoves.find((moveLearn) => moveLearn.moveId.toString() === id),
        )
      ) {
        pokemon.moves = movesId as unknown as IMove[];
        await this.update(pokemonId, pokemon);
      }
    }
  }

  public async modifyMoveStrategy(
    strategies: {
      pokemonId: string;
      strategy: number[];
    }[],
    trainerId: string,
    gameId: string,
  ): Promise<void> {
    let pokemons = await this.pokemonRepository.list(
      { ids: strategies.map((strategy) => strategy.pokemonId) },
      { gameId },
    );
    if (
      pokemons.length !== 0 &&
      pokemons?.every((pokemon) => pokemon.trainerId.toString() === trainerId)
    ) {
      pokemons = pokemons.map((pokemon, index) => {
        pokemon.strategy = strategies[index].strategy;
        return pokemon;
      });
      await this.updateMany(pokemons, gameId);
    }
  }

  public async modifyBattleMoveStrategy(
    strategies: {
      pokemonId: string;
      strategy: number[];
    }[],
    trainerId: string,
    gameId: string,
  ): Promise<void> {
    let pokemons = await this.pokemonRepository.list(
      { ids: strategies.map((strategy) => strategy.pokemonId) },
      { gameId },
    );
    if (
      pokemons.length !== 0 &&
      pokemons?.every((pokemon) => pokemon.trainerId.toString() === trainerId)
    ) {
      pokemons = pokemons.map((pokemon, index) => {
        pokemon.battleStrategy = strategies[index].strategy;
        return pokemon;
      });
      await this.updateMany(pokemons, gameId);
    }
  }

  public async hatchEgg(eggId: string, gameId: string): Promise<void> {
    const pokemon = await this.pokemonRepository.get(eggId, { gameId });
    const game = await this.gameRepository.get(gameId);
    if (
      game &&
      pokemon?.hatchingDate <= game.actualDate &&
      pokemon.level === 0
    ) {
      pokemon.level = 1;
      pokemon.hatchingDate = null;
      await this.update(eggId, pokemon);
    }
  }

  public async evolve(pokemonId: string, gameId: string): Promise<void> {
    const pokemon = await this.pokemonRepository.get(pokemonId, { gameId });
    if (pokemon) {
      const evolution = await this.evolutionRepository.evolve(
        pokemon.basePokemon.id,
        pokemon.level,
        'LEVEL-UP',
      );
      if (evolution) {
        pokemon.basePokemon = evolution;
      }
      await this.update(pokemonId, pokemon);
    }
  }

  public async releasePokemon(
    pokemonId: string,
    gameId: string,
  ): Promise<void> {
    const pokemon = await this.pokemonRepository.get(pokemonId, { gameId });
    if (pokemon?.level === 0) {
      await this.pokemonRepository.delete(pokemonId);
    }
  }
}

export default PokemonService;
