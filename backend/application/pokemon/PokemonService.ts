import { IPokemon } from "../../domain/pokemon/Pokemon";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import PokemonUtilsService from "./PokemonUtilsService";
import PokemonMapper from "../../domain/pokemon/PokemonMapper";
import { eggHatched } from "../../websocketServer";
import { INursery } from "../../domain/nursery/Nursery";
import PokemonBaseService from "../pokemonBase/PokemonBaseService";
import PokemonBaseRepository from "../../domain/pokemonBase/PokemonBaseRepository";
import GameRepository from "../../domain/game/GameRepository";

class PokemonService {
  private static instance: PokemonService;

  public static getInstance(): PokemonService {
    if (!PokemonService.instance) {
      PokemonService.instance = new PokemonService(
        PokemonRepository.getInstance(),
        TrainerRepository.getInstance(),
        PokemonUtilsService.getInstance(),
        PokemonMapper.getInstance(),
        PokemonBaseService.getInstance(),
        PokemonBaseRepository.getInstance(),
        GameRepository.getInstance(),
      );
    }
    return PokemonService.instance;
  }

  constructor(
    protected pokemonRepository: PokemonRepository,
    protected trainerRepository: TrainerRepository,
    protected pokemonUtilsService: PokemonUtilsService,
    protected pokemonMapper: PokemonMapper,
    protected pokemonBaseService: PokemonBaseService,
    protected pokemonBaseRepository: PokemonBaseRepository,
    protected gameRepository: GameRepository,
  ) {}

  public async create(pokemon: IPokemon, gameId: string): Promise<IPokemon> {
    let newPokemon: IPokemon;
    if (pokemon.level === 0) {
      newPokemon = await this.createEgg(pokemon, gameId);
    } else {
      newPokemon = await this.createPokemon(pokemon, gameId);
    }
    newPokemon.shiny = this.pokemonUtilsService.generateShiny();
    return this.savePokemon(newPokemon, gameId);
  }

  public async createPokemon(
    pokemon: IPokemon,
    gameId: string,
  ): Promise<IPokemon> {
    pokemon.gameId = gameId;
    if (!pokemon.birthday) {
      pokemon.birthday = (await this.gameRepository.get(gameId)).actualDate;
    }
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
    if (!pokemon.potential) {
      pokemon.potential = 100;
    }
    if (pokemon.age === undefined) {
      pokemon.age = 0;
    }
    if (pokemon.trainingPercentage === undefined) {
      pokemon.trainingPercentage = 0;
    }
    pokemon.maxLevel = pokemon.level;
    pokemon = await this.pokemonMapper.update(pokemon);
    return pokemon;
  }

  public async createEgg(pokemon: IPokemon, gameId: string): Promise<IPokemon> {
    pokemon = await this.createPokemon(pokemon, gameId);
    pokemon.hatchingDate = pokemon.birthday;
    pokemon.hatchingDate.setMonth(pokemon.birthday.getUTCMonth() + 3);
    pokemon.birthday = undefined;
    return pokemon;
  }

  public async savePokemon(
    newPokemon: IPokemon,
    gameId: string,
  ): Promise<IPokemon> {
    const createdPokemon = await this.pokemonRepository.create(
      newPokemon,
      gameId,
    );
    if (createdPokemon.trainerId) {
      this.trainerRepository
        .findOneAndUpdate(
          { _id: createdPokemon.trainerId },
          { $push: { pokemons: createdPokemon._id } },
        )
        .then()
        .catch((error: Error) => console.log(error));
    }
    return createdPokemon;
  }

  public async isHatched(actualDate: Date, gameId: string): Promise<void> {
    const hatched = await this.pokemonRepository.listComplete(
      { custom: { hatchingDate: { $lte: actualDate } } },
      gameId,
    );
    hatched.forEach(eggHatched);
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
        potential: 25,
        exp: 0,
        iv: this.pokemonUtilsService.generateIvs(),
        ev: this.pokemonUtilsService.initEvs(),
        happiness: base.baseHappiness,
        gameId,
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
}

export default PokemonService;
