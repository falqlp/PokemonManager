import CompleteService from "../CompleteService";
import Nursery, { INursery } from "./Nursery";
import NurseryMapper from "./NurseryMapper";
import { Model } from "mongoose";
import { IMapper } from "../IMapper";
import PokemonService from "../pokemon/PokemonService";
import { IPokemon } from "../pokemon/Pokemon";

class NurseryService extends CompleteService<INursery> {
  private static instance: NurseryService;

  constructor(
    schema: Model<INursery>,
    mapper: IMapper<INursery>,
    protected pokemonService: PokemonService,
  ) {
    super(schema, mapper);
  }

  public static getInstance(): NurseryService {
    if (!NurseryService.instance) {
      NurseryService.instance = new NurseryService(
        Nursery,
        NurseryMapper.getInstance(),
        PokemonService.getInstance(),
      );
    }
    return NurseryService.instance;
  }

  public async generateNurseryEgg(
    nursery: INursery,
    gameId: string,
  ): Promise<INursery> {
    const eggs: IPokemon[] = [];
    for (let i = 0; i < nursery.wishList.quantity * 4; i++) {
      eggs.push(await this.pokemonService.generateEgg(nursery, gameId));
    }
    nursery.eggs = eggs;
    return this.update(nursery._id, nursery);
  }
}

export default NurseryService;
