import Pokemon, { IPokemon } from "./pokemon";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";
import Trainer from "../trainer/trainer";
import CompleteService from "../CompleteService";
import PokemonMapper from "./pokemon.mapper";
import { ListBody } from "../ReadOnlyService";
import Game from "../game/game";
import { eggHatched } from "../../websocketServer";
import { Model } from "mongoose";
import { IMapper } from "../IMapper";
import PokemonBaseService from "../pokemonBase/pokemonBase.service";
import Nursery, { INursery, IWishList } from "../nursery/nursery";
import normalRandomUtils from "../../utils/normalRandomUtils";

class PokemonService extends CompleteService<IPokemon> {
  private static instance: PokemonService;

  constructor(
    schema: Model<IPokemon>,
    mapper: IMapper<IPokemon>,
    protected pokemonBaseService: PokemonBaseService
  ) {
    super(schema, mapper);
  }
  public static getInstance(): PokemonService {
    if (!PokemonService.instance) {
      PokemonService.instance = new PokemonService(
        Pokemon,
        PokemonMapper.getInstance(),
        PokemonBaseService.getInstance()
      );
    }
    return PokemonService.instance;
  }
  public async getComplete(_id: string): Promise<IPokemon> {
    return await this.get(_id, { map: this.mapper.mapComplete });
  }
  public async listComplete(
    body: ListBody,
    gameId?: string
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
    return this.savePokemon(newPokemon, gameId);
  }

  public async createPokemon(
    pokemon: IPokemon,
    gameId: string
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
      pokemon.iv = this.generateIvs();
    }
    if (pokemon.ev === undefined) {
      pokemon.ev = this.initEvs();
    }
    if (!pokemon.potential) {
      pokemon.potential = 100;
    }
    if (pokemon.age === undefined) {
      pokemon.age = 0;
    }
    if (pokemon.trainingPourcentage === undefined) {
      pokemon.trainingPourcentage = 0;
    }
    pokemon.maxLevel = pokemon.level;
    pokemon = await this.mapper.update(pokemon);
    return pokemon;
  }

  public generateIvs(): IPokemonStats {
    return {
      hp: Math.floor(Math.random() * 32),
      atk: Math.floor(Math.random() * 32),
      def: Math.floor(Math.random() * 32),
      spAtk: Math.floor(Math.random() * 32),
      spDef: Math.floor(Math.random() * 32),
      spe: Math.floor(Math.random() * 32),
    } as IPokemonStats;
  }

  public initEvs(): IPokemonStats {
    return {
      hp: 0,
      atk: 0,
      def: 0,
      spAtk: 0,
      spDef: 0,
      spe: 0,
    } as IPokemonStats;
  }

  public async savePokemon(
    newPokemon: IPokemon,
    gameId: string
  ): Promise<IPokemon> {
    const createdPokemon = await super.create(newPokemon, gameId);
    if (createdPokemon.trainerId) {
      Trainer.findOneAndUpdate(
        { _id: createdPokemon.trainerId },
        { $push: { pokemons: createdPokemon._id } }
      )
        .then()
        .catch((error: Error) => console.log(error));
    }
    return createdPokemon;
  }

  public async createEgg(pokemon: IPokemon, gameId: string) {
    pokemon = await this.createPokemon(pokemon, gameId);
    pokemon.hatchingDate = pokemon.birthday;
    pokemon.hatchingDate.setMonth(pokemon.birthday.getUTCMonth() + 3);
    pokemon.birthday = undefined;
    return pokemon;
  }
  public async isHatched(actualDate: Date, gameId: string) {
    const hatched = await this.listComplete(
      { custom: { hatchingDate: { $lte: actualDate } } },
      gameId
    );
    hatched.forEach(eggHatched);
  }

  public async generateEgg(
    nursery: INursery,
    gameId: string
  ): Promise<IPokemon> {
    let potential =
      10 + Math.floor(normalRandomUtils.normalRandom(nursery.level * 10, 6));
    if (potential > 100) {
      potential = 100;
    }
    if (potential < 0) {
      potential = 0;
    }
    const egg = {
      basePokemon: await this.pokemonBaseService.generateEggBase(
        nursery.wishList
      ),
      level: 0,
      potential,
    };
    return this.create(egg as IPokemon, gameId);
  }

  public override async delete(_id: string) {
    await Trainer.updateMany(
      { pokemons: { $in: [_id] } },
      { $pull: { pokemons: _id } }
    );
    await Nursery.updateMany(
      { eggs: { $in: [_id] } },
      { $pull: { eggs: _id } }
    );
    return super.delete(_id);
  }
}

export default PokemonService;
