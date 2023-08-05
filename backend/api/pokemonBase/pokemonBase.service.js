const PokemonBase = require("./pokemonBase");
const pokemonBaseMapper = require("./pokemonBase.mapper");
const ReadOnlyService = require("../ReadOnlyService");

const PokemonBaseService = {
  ...new ReadOnlyService(PokemonBase, pokemonBaseMapper),
};

module.exports = PokemonBaseService;
