import PokemonBase from "./pokemonBase";
import pokemonBaseMapper from "./pokemonBase.mapper";
import ReadOnlyService from "../ReadOnlyService";

const PokemonBaseService = {
  ...new ReadOnlyService(PokemonBase, pokemonBaseMapper),
};

export default PokemonBaseService;
