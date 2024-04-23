import Pokemon, { IPokemon } from "./Pokemon";
import { IMapper } from "../IMapper";
import Game from "../game/Game";
import { updatePlayer } from "../../websocketServer";
import PokemonBase, { IPokemonBase } from "../pokemonBase/PokemonBase";
import { PopulateOptions } from "mongoose";
import Move from "../move/Move";
import PokemonUtilsService from "../../application/pokemon/PokemonUtilsService";

class PokemonMapper implements IMapper<IPokemon> {
  private static instance: PokemonMapper;
  constructor(private pokemonUtilsService: PokemonUtilsService) {}

  public populate(): PopulateOptions[] {
    return [
      { path: "moves", model: Move },
      { path: "basePokemon", model: PokemonBase },
    ];
  }

  public map(pokemon: IPokemon): IPokemon {
    delete pokemon.ev;
    delete pokemon.iv;
    delete pokemon.happiness;
    delete pokemon.potential;
    delete pokemon.trainingPercentage;
    if (pokemon.level === 0) {
      delete pokemon.basePokemon;
      delete pokemon.hatchingDate;
      delete pokemon.shiny;
    }
    return pokemon;
  }

  public mapComplete = (pokemon: IPokemon): IPokemon => {
    return pokemon;
  };

  public mapPartial = (pokemon: IPokemon): IPokemon => {
    delete pokemon.ev;
    delete pokemon.iv;
    delete pokemon.happiness;
    delete pokemon.potential;
    delete pokemon.trainingPercentage;
    delete pokemon.hatchingDate;
    pokemon.basePokemon = {
      types: pokemon.basePokemon.types,
    } as unknown as IPokemonBase;
    return pokemon;
  };

  // Todo a refactor
  public async update(pokemon: IPokemon): Promise<IPokemon> {
    const oldPokemon: IPokemon = { ...pokemon } as IPokemon;
    if (pokemon.iv && pokemon.ev) {
      pokemon.stats = this.pokemonUtilsService.updateStats(pokemon);
      if (!pokemon.hiddenPotential) {
        pokemon.hiddenPotential =
          this.pokemonUtilsService.generateHiddenPotential(pokemon.potential);
      }
    } else {
      const savedPokemon = await Pokemon.findOne({ _id: pokemon._id }).populate(
        this.populate(),
      );
      if (!pokemon.trainerId) {
        pokemon.trainerId = savedPokemon.trainerId;
      }
      pokemon.gameId = savedPokemon.gameId;
      if (!pokemon.hiddenPotential) {
        pokemon.hiddenPotential =
          this.pokemonUtilsService.generateHiddenPotential(
            savedPokemon.potential ?? pokemon.potential,
          );
      }
      if (pokemon.level <= 1 || !pokemon.basePokemon?.id) {
        pokemon.basePokemon = savedPokemon.basePokemon;
      }
      pokemon.ev = savedPokemon.ev;
      pokemon.iv = savedPokemon.iv;
      pokemon.stats = this.pokemonUtilsService.updateStats(pokemon);
      if (pokemon.level && pokemon.level !== 0 && savedPokemon.hatchingDate) {
        pokemon.birthday = savedPokemon.hatchingDate;
        pokemon.hatchingDate = null;
      }
    }
    if (pokemon.birthday) {
      pokemon.age = this.pokemonUtilsService.calculateAge(
        pokemon.birthday,
        (await Game.findOne({ _id: pokemon.gameId })).actualDate,
      );
    }
    const newPokemon = { ...pokemon };
    delete newPokemon.iv;
    delete newPokemon.ev;
    delete oldPokemon.iv;
    delete oldPokemon.ev;
    delete oldPokemon.stats;
    if (!(JSON.stringify(newPokemon) === JSON.stringify(oldPokemon))) {
      await updatePlayer(pokemon.trainerId, pokemon.gameId);
    }
    return pokemon;
  }

  public static getInstance(): PokemonMapper {
    if (!PokemonMapper.instance) {
      PokemonMapper.instance = new PokemonMapper(
        PokemonUtilsService.getInstance(),
      );
    }
    return PokemonMapper.instance;
  }
}

export default PokemonMapper;
