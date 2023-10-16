import Pokemon, { IPokemon } from "./pokemon";
import { IMapper } from "../IMapper";
import MoveService from "../move/move.service";
import PokemonBaseService from "../pokemonBase/pokemonBase.service";
import { IPokemonStats } from "../../models/PokemonModels/pokemonStats";
import Game from "../game/game";
import { updatePlayer } from "../../websocketServer";

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
    if (pokemon.level === 0) {
      pokemon.basePokemon = undefined;
      pokemon.hatchingDate = undefined;
    }
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
      if (!pokemon.hiddenPotential) {
        pokemon.hiddenPotential = this.generateHiddenPotentail(
          pokemon.potential
        );
      }
    } else {
      const savedPokemon = await Pokemon.findOne({ _id: pokemon._id }).populate(
        "basePokemon"
      );
      pokemon.trainerId = savedPokemon.trainerId;
      pokemon.gameId = savedPokemon.gameId;
      pokemon.ev = savedPokemon.ev;
      pokemon.iv = savedPokemon.iv;
      if (!pokemon.hiddenPotential) {
        pokemon.hiddenPotential = this.generateHiddenPotentail(
          savedPokemon.potential ?? pokemon.potential
        );
      }
      if (pokemon.level <= 1) {
        pokemon.basePokemon = savedPokemon.basePokemon;
      }
      pokemon.stats = this.updateStats(pokemon);
      if (pokemon.level !== 0 && savedPokemon.hatchingDate) {
        pokemon.birthday = pokemon.hatchingDate;
        await Pokemon.updateOne(
          { _id: pokemon._id },
          { $unset: { hatchingDate: "" } }
        );
        pokemon.hatchingDate = undefined;
      }
    }
    if (pokemon.birthday) {
      pokemon.age = await this.calculateAge(pokemon.birthday);
    }
    await updatePlayer(pokemon.trainerId, pokemon.gameId);
    return pokemon;
  }

  public updateStats(pokemon: IPokemon): IPokemonStats {
    if (pokemon.level === 0) {
      return {
        hp: 0,
        atk: 0,
        def: 0,
        spe: 0,
        spAtk: 0,
        spDef: 0,
      } as IPokemonStats;
    }
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
    const today = (await Game.find())[0].actualDate;
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

  public generateHiddenPotentail(potential: number): string {
    const pMin = potential - Math.floor(Math.random() * 11);
    const pMax = potential + Math.floor(Math.random() * 11);
    return `${pMin < 0 ? 0 : pMin} - ${pMax > 100 ? 100 : pMax}`;
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
