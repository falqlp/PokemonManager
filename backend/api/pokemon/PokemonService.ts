import Pokemon, { IPokemon } from "./Pokemon";
import Trainer from "../../domain/trainer/Trainer";
import CompleteService from "../CompleteService";
import PokemonMapper from "./PokemonMapper";
import { ListBody } from "../ReadOnlyService";
import Game from "../../domain/game/Game";
import { eggHatched } from "../../websocketServer";
import { Model } from "mongoose";
import { IMapper } from "../IMapper";
import PokemonBaseRepository from "../../domain/pokemonBase/PokemonBaseRepository";
import Nursery, { INursery } from "../nursery/Nursery";
import PokemonUtilsService from "./PokemonUtilsService";
import PokemonBaseService from "../../application/pokemonBase/PokemonBaseService";

class PokemonService extends CompleteService<IPokemon> {
  private static instance: PokemonService;

  constructor(
    schema: Model<IPokemon>,
    mapper: IMapper<IPokemon>,
    protected pokemonBaseRepository: PokemonBaseRepository,
    protected pokemonBaseService: PokemonBaseService,
    protected pokemonUtilsService: PokemonUtilsService,
  ) {
    super(schema, mapper);
  }

  public static getInstance(): PokemonService {
    if (!PokemonService.instance) {
      PokemonService.instance = new PokemonService(
        Pokemon,
        PokemonMapper.getInstance(),
        PokemonBaseRepository.getInstance(),
        PokemonBaseService.getInstance(),
        PokemonUtilsService.getInstance(),
      );
    }
    return PokemonService.instance;
  }

  public async listComplete(
    body: ListBody,
    gameId?: string,
  ): Promise<IPokemon[]> {
    return await this.list(body, { map: this.mapper.mapComplete, gameId });
  }

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
      pokemon.birthday = (await Game.findById(gameId)).actualDate;
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
    pokemon = await this.mapper.update(pokemon);
    return pokemon;
  }

  public async savePokemon(
    newPokemon: IPokemon,
    gameId: string,
  ): Promise<IPokemon> {
    const createdPokemon = await super.create(newPokemon, gameId);
    if (createdPokemon.trainerId) {
      Trainer.findOneAndUpdate(
        { _id: createdPokemon.trainerId },
        { $push: { pokemons: createdPokemon._id } },
      )
        .then()
        .catch((error: Error) => console.log(error));
    }
    return createdPokemon;
  }

  public async createEgg(pokemon: IPokemon, gameId: string): Promise<IPokemon> {
    pokemon = await this.createPokemon(pokemon, gameId);
    pokemon.hatchingDate = pokemon.birthday;
    pokemon.hatchingDate.setMonth(pokemon.birthday.getUTCMonth() + 3);
    pokemon.birthday = undefined;
    return pokemon;
  }

  public async isHatched(actualDate: Date, gameId: string): Promise<void> {
    const hatched = await this.listComplete(
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

  public override async delete(_id: string): Promise<IPokemon> {
    await Trainer.updateMany(
      { pokemons: { $in: [_id] } },
      { $pull: { pokemons: _id } },
    );
    await Nursery.updateMany(
      { eggs: { $in: [_id] } },
      { $pull: { eggs: _id } },
    );
    return super.delete(_id);
  }

  public async generateStarters(gameId: string): Promise<IPokemon[]> {
    const actualDate: Date = (await Game.findById(gameId)).actualDate;

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
