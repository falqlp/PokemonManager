import moveService from "../move/move.service";
import pokemonBaseService from "../pokemonBase/pokemonBase.service";
import { IPokemon } from "./pokemon";

const PokemonMapper = {
  map: async function (pokemon: IPokemon): Promise<IPokemon> {
    // @ts-ignore
    pokemon.moves = await moveService.list({ ids: pokemon.moves });
    // @ts-ignore
    pokemon.basePokemon = await pokemonBaseService.get(pokemon.basePokemon);
    return pokemon;
  },

  update: function (pokemon: IPokemon): IPokemon {
    pokemon.moves = pokemon.moves?.map((move) => move._id);
    pokemon.basePokemon = pokemon.basePokemon._id;
    return pokemon;
  },
};

export default PokemonMapper;
