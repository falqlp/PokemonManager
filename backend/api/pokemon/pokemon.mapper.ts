import Pokemon, { IPokemon } from "./pokemon";
import { IMapper } from "../IMapper";
import MoveService from "../move/move.service";
import PokemonBaseService from "../pokemonBase/pokemonBase.service";

class PokemonMapper implements IMapper<IPokemon> {
  private static instance: PokemonMapper;
  constructor(
    protected moveService: MoveService,
    protected pokemonBaseService: PokemonBaseService
  ) {}
  public async map(pokemon: IPokemon): Promise<IPokemon> {
    pokemon.moves = await this.moveService.list({
      ids: pokemon.moves as unknown as string[],
    });
    pokemon.basePokemon = await this.pokemonBaseService.get(
      pokemon.basePokemon as unknown as string
    );
    return pokemon;
  }

  public update(pokemon: IPokemon): IPokemon {
    pokemon.moves = pokemon.moves?.map((move) => move._id);
    pokemon.basePokemon = pokemon.basePokemon._id;
    return pokemon;
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
