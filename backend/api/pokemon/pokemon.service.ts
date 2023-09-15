import Pokemon, { IPokemon } from "./pokemon";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";
import Trainer from "../trainer/trainer";
import CompleteService from "../CompleteService";
import PokemonMapper from "./pokemon.mapper";
import { ListBody } from "../ReadOnlyService";

class PokemonService extends CompleteService<IPokemon> {
  private static instance: PokemonService;
  public static getInstance(): PokemonService {
    if (!PokemonService.instance) {
      PokemonService.instance = new PokemonService(
        Pokemon,
        PokemonMapper.getInstance()
      );
    }
    return PokemonService.instance;
  }
  public createPokemon(pokemon: IPokemon): IPokemon {
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

  public async create(pokemon: IPokemon): Promise<any> {
    const newPokemon = new Pokemon({
      ...(await this.mapper.update(this.createPokemon(pokemon))),
    });
    if (newPokemon.trainerId) {
      Trainer.findOneAndUpdate(
        { _id: newPokemon.trainerId },
        { $push: { pokemons: newPokemon._id } }
      )
        .then()
        .catch((error: Error) => console.log(error));
    }
    return newPokemon.save();
  }
  public async getComplete(_id: string): Promise<IPokemon> {
    return await this.get(_id, this.mapper.mapComplete);
  }
  public async listComplete(body: ListBody): Promise<IPokemon[]> {
    return await this.list(body, this.mapper.mapComplete);
  }
}

export default PokemonService;
