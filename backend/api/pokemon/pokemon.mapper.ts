import Pokemon, { IPokemon } from "./pokemon";
import { IMapper } from "../IMapper";
import MoveService from "../move/move.service";
import PokemonBaseService from "../pokemonBase/pokemonBase.service";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";
import Party from "../party/party";

class PokemonMapper implements IMapper<IPokemon> {
  private static instance: PokemonMapper;
  constructor(
    protected moveService: MoveService,
    protected pokemonBaseService: PokemonBaseService
  ) {}
  public async map(pokemon: IPokemon): Promise<IPokemon> {
    pokemon = await this.mapComplete(pokemon);
    pokemon.ev = undefined;
    pokemon.iv = undefined;
    pokemon.happiness = undefined;
    pokemon.potential = undefined;
    pokemon.trainingPourcentage = undefined;
    return pokemon;
  }

  public mapComplete = async (pokemon: IPokemon): Promise<IPokemon> => {
    pokemon.moves = await this.moveService.list({
      ids: pokemon.moves as unknown as string[],
    });
    pokemon.basePokemon = await this.pokemonBaseService.get(
      pokemon.basePokemon as unknown as string
    );
    return pokemon;
  };

  public async update(pokemon: IPokemon): Promise<IPokemon> {
    if (pokemon.iv && pokemon.ev) {
      pokemon.stats = this.updateStats(pokemon);
    } else {
      pokemon = await Pokemon.findOne({ _id: pokemon._id }).populate(
        "basePokemon"
      );
      pokemon.stats = this.updateStats(pokemon);
    }
    pokemon.age = await this.calculateAge(pokemon.birthday);
    return pokemon;
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

  public async calculateAge(birthdate: Date): Promise<number> {
    birthdate = new Date(birthdate);
    const today = (await Party.find())[0].actualDate;
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }
    return age;
  }

  public static getInstance(): PokemonMapper {
    if (!PokemonMapper.instance) {
      PokemonMapper.instance = new PokemonMapper(
        MoveService.getInstance(),
        PokemonBaseService.getInstance()
      );
    }
    return PokemonMapper.instance;
  }
}

export default PokemonMapper;
