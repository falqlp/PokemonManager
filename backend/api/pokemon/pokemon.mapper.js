const moveService = require("../move/move.service");
const pokemonBaseService = require("../pokemonBase/pokemonBase.service");

const PokemonMapper = {
  map: async function (pokemon) {
    pokemon.moves = await moveService.list(pokemon.moves);
    pokemon.basePokemon = await pokemonBaseService.get(pokemon.basePokemon);
    return pokemon;
  },

  update: function (pokemon) {
    pokemon.moves = pokemon.moves?.map((moves) => moves._id);
    pokemon.basePokemon = pokemon.basePokemon._id;
    return pokemon;
  },
};
module.exports = PokemonMapper;
