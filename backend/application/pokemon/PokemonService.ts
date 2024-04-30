import { IPokemon, PokemonNature } from "../../domain/pokemon/Pokemon";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import PokemonUtilsService from "./PokemonUtilsService";
import { INursery } from "../../domain/nursery/Nursery";
import PokemonBaseService from "../pokemonBase/PokemonBaseService";
import PokemonBaseRepository from "../../domain/pokemonBase/PokemonBaseRepository";
import GameRepository from "../../domain/game/GameRepository";
import WebsocketServerService from "../../WebsocketServerService";
import { singleton } from "tsyringe";
import MoveLearningService from "../moveLearning/MoveLearningService";

@singleton()
class PokemonService {
  constructor(
    protected pokemonRepository: PokemonRepository,
    protected trainerRepository: TrainerRepository,
    protected pokemonUtilsService: PokemonUtilsService,
    protected pokemonBaseService: PokemonBaseService,
    protected pokemonBaseRepository: PokemonBaseRepository,
    protected gameRepository: GameRepository,
    protected websocketServerService: WebsocketServerService,
    protected moveLearningService: MoveLearningService,
  ) {}

  public async update(_id: string, pokemon: IPokemon): Promise<IPokemon> {
    const oldPokemon = await this.pokemonRepository.get(_id);
    pokemon.ev = pokemon.ev ?? oldPokemon.ev;
    pokemon.iv = pokemon.iv ?? oldPokemon.iv;
    pokemon.basePokemon = pokemon.basePokemon ?? oldPokemon.basePokemon;
    pokemon.nature = pokemon.nature ?? oldPokemon.nature ?? PokemonNature.HARDY;
    pokemon.stats = this.pokemonUtilsService.updateStats(pokemon);
    pokemon.birthday = pokemon.birthday ?? oldPokemon.birthday;
    if (pokemon.level === 1 && pokemon.level !== oldPokemon.level) {
      await this.pokemonRepository.findOneAndUpdate(
        { _id },
        { $set: { hatchingDate: null } },
      );
      pokemon.hatchingDate = null;
    }
    const actualDate = (await this.gameRepository.get(pokemon.gameId))
      .actualDate;
    if (!pokemon.birthday) {
      pokemon.birthday = actualDate;
    }
    pokemon.age = this.pokemonUtilsService.calculateAge(
      pokemon.birthday ?? oldPokemon.birthday,
      actualDate,
    );
    await this.websocketServerService.updatePlayer(
      pokemon.trainerId ?? oldPokemon.trainerId,
      pokemon.gameId,
    );
    return this.pokemonRepository.update(_id, pokemon);
  }

  public async create(pokemon: IPokemon, gameId: string): Promise<IPokemon> {
    let newPokemon: IPokemon;
    const actualDate = (await this.gameRepository.get(gameId)).actualDate;
    if (pokemon.level === 0) {
      newPokemon = await this.createEgg(pokemon, gameId, actualDate);
    } else {
      newPokemon = await this.createPokemon(pokemon, gameId, actualDate);
    }
    newPokemon.shiny = this.pokemonUtilsService.generateShiny();
    return this.savePokemon(newPokemon, gameId);
  }

  public async createPokemon(
    pokemon: IPokemon,
    gameId: string,
    actualDate: Date,
  ): Promise<IPokemon> {
    pokemon.gameId = gameId;

    if (pokemon.nickname === "") {
      pokemon.nickname = null;
    }
    if (!pokemon.happiness) {
      pokemon.happiness = pokemon.basePokemon.baseHappiness;
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
    if (pokemon.age === undefined) {
      pokemon.age = 0;
    }
    pokemon.age = this.pokemonUtilsService.calculateAge(
      pokemon.birthday,
      actualDate,
    );
    if (!pokemon.potential) {
      pokemon.potential = 100;
    }
    if (!pokemon.hiddenPotential) {
      pokemon.hiddenPotential =
        this.pokemonUtilsService.generateHiddenPotential(pokemon.potential);
    }
    pokemon.stats = this.pokemonUtilsService.updateStats(pokemon);
    pokemon.maxLevel = pokemon.level;
    return pokemon;
  }

  public async createEgg(
    pokemon: IPokemon,
    gameId: string,
    actualDate: Date,
  ): Promise<IPokemon> {
    pokemon = await this.createPokemon(pokemon, gameId, actualDate);
    pokemon.hatchingDate = pokemon.birthday;
    pokemon.hatchingDate.setMonth(pokemon.birthday.getUTCMonth() + 3);
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
      await this.websocketServerService.updatePlayer(
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
      this.websocketServerService.eggHatched(egg);
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

  public async generateStarters(gameId: string): Promise<IPokemon[]> {
    const actualDate: Date = (await this.gameRepository.get(gameId)).actualDate;

    const pokemonBases =
      await this.pokemonBaseRepository.getStartersBase(gameId);
    const starters: IPokemon[] = [];
    for (const base of pokemonBases) {
      const starter: IPokemon = {
        basePokemon: base,
        level: 5,
        potential: 30,
        exp: 0,
        iv: this.pokemonUtilsService.generateIvs(),
        ev: this.pokemonUtilsService.initEvs(),
        happiness: base.baseHappiness,
        gameId,
        moves: (
          await this.moveLearningService.learnableMoves(base.id, 5, {
            sort: { power: -1 },
          })
        ).slice(0, 2),
        trainerId: null,
        nickname: null,
        shiny: this.pokemonUtilsService.generateShiny(),
        birthday: actualDate,
        hatchingDate: null,
        age: 1,
        trainingPercentage: 0,
        maxLevel: 5,
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
      await this.createPokemon(pokemon, gameId, actualDate);
    }
    return await this.pokemonRepository.insertMany(pokemons);
  }
}

export default PokemonService;
