import Pokemon, { IPokemon } from "./pokemon";
import pokemonMapper from "./pokemon.mapper";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";
import Trainer from "../trainer/trainer";
import CompleteService from "../CompleteService";
import TrainerMapper from "../trainer/trainer.mapper";
import PokemonMapper from "./pokemon.mapper";

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
    if (pokemon.exp === undefined) {
      pokemon.exp = 0;
    }
    if (pokemon.expMax === undefined) {
      pokemon.expMax = 100;
    }
    if (pokemon.iv === undefined) {
      pokemon.iv = this.generateIvs();
    }
    if (pokemon.ev === undefined) {
      pokemon.ev = this.initEvs();
    }
    pokemon.stats = this.updateStats(pokemon);
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

  public updateStats(pokemon: IPokemon): IPokemonStats {
    return {
      hp: this.calcHp(
        pokemon.basePokemon.baseStats.hp,
        pokemon.level,
        pokemon.iv.hp,
        pokemon.ev.hp
      ),
      atk: this.calcStat(
        pokemon.basePokemon.baseStats.atk,
        pokemon.level,
        pokemon.iv.atk,
        pokemon.ev.atk
      ),
      def: this.calcStat(
        pokemon.basePokemon.baseStats.def,
        pokemon.level,
        pokemon.iv.def,
        pokemon.ev.def
      ),
      spAtk: this.calcStat(
        pokemon.basePokemon.baseStats.spAtk,
        pokemon.level,
        pokemon.iv.spAtk,
        pokemon.ev.spAtk
      ),
      spDef: this.calcStat(
        pokemon.basePokemon.baseStats.spDef,
        pokemon.level,
        pokemon.iv.spDef,
        pokemon.ev.spDef
      ),
      spe: this.calcStat(
        pokemon.basePokemon.baseStats.spe,
        pokemon.level,
        pokemon.iv.spe,
        pokemon.ev.spe
      ),
    } as IPokemonStats;
  }

  public calcStat(bs: number, niv: number, iv: number, ev: number): number {
    return (
      Math.floor(
        ((2 * bs + (ev === 0 ? 0 : Math.floor(ev / 4)) + iv) * niv) / 100
      ) + 5
    );
  }

  public calcHp(bs: number, niv: number, iv: number, ev: number): number {
    return (
      Math.floor(
        ((2 * bs + (ev === 0 ? 0 : Math.floor(ev / 4)) + iv) * niv) / 100
      ) +
      niv +
      10
    );
  }

  public create(pokemon: IPokemon): Promise<any> {
    const newPokemon = new Pokemon({
      ...this.mapper.update(this.createPokemon(pokemon)),
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
}

export default PokemonService;
