import { IPokemon } from "../../domain/pokemon/Pokemon";
import { IMapper } from "../../domain/IMapper";
import { IPokemonBase } from "../../domain/pokemonBase/PokemonBase";
import { singleton } from "tsyringe";

@singleton()
class PokemonMapper implements IMapper<IPokemon> {
  public map(pokemon: IPokemon): IPokemon {
    pokemon.ev = undefined;
    pokemon.iv = undefined;
    pokemon.happiness = undefined;
    pokemon.potential = undefined;
    pokemon.trainingPercentage = undefined;
    if (pokemon.level === 0) {
      pokemon.basePokemon = undefined;
      pokemon.hatchingDate = undefined;
      pokemon.shiny = undefined;
    }
    return pokemon;
  }

  public mapNurserySecondSelection = (pokemon: IPokemon): IPokemon => {
    pokemon.ev = undefined;
    pokemon.iv = undefined;
    pokemon.happiness = undefined;
    pokemon.potential = undefined;
    pokemon.trainingPercentage = undefined;
    pokemon.hatchingDate = undefined;
    pokemon.shiny = undefined;
    pokemon.basePokemon = {
      types: pokemon.basePokemon.types,
    } as unknown as IPokemonBase;
    return pokemon;
  };

  public mapNurseryFirstSelection = (pokemon: IPokemon): IPokemon => {
    pokemon = this.mapNurserySecondSelection(pokemon);
    pokemon.basePokemon.types = undefined;
    return pokemon;
  };

  public mapStarters = (pokemon: IPokemon): IPokemon => {
    delete pokemon.ev;
    delete pokemon.iv;
    delete pokemon.happiness;
    delete pokemon.trainingPercentage;
    delete pokemon.hatchingDate;
    return pokemon;
  };
}

export default PokemonMapper;
