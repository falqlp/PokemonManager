import { INursery } from "../../domain/nursery/Nursery";
import { IPokemon } from "../../domain/pokemon/Pokemon";
import NurseryRepository from "../../domain/nursery/NurseryRepository";
import PokemonService from "../pokemon/PokemonService";

class NurseryService {
  private static instance: NurseryService;

  public static getInstance(): NurseryService {
    if (!NurseryService.instance) {
      NurseryService.instance = new NurseryService(
        NurseryRepository.getInstance(),
        PokemonService.getInstance(),
      );
    }
    return NurseryService.instance;
  }

  constructor(
    protected nurseryRepository: NurseryRepository,
    protected pokemonService: PokemonService,
  ) {}

  public async generateNurseryEgg(
    nursery: INursery,
    gameId: string,
  ): Promise<INursery> {
    const eggs: IPokemon[] = [];
    for (let i = 0; i < nursery.wishList.quantity * 4; i++) {
      eggs.push(await this.pokemonService.generateEgg(nursery, gameId));
    }
    nursery.eggs = eggs;
    return this.nurseryRepository.update(nursery._id, nursery);
  }
}

export default NurseryService;
