import { singleton } from "tsyringe";
import { IPcStorage } from "../../../domain/trainer/pcStorage/PcStorage";
import PcStorageRepository from "../../../domain/trainer/pcStorage/PcStorageRepository";
import PokemonService from "../../pokemon/PokemonService";

@singleton()
export class PcStorageService {
  constructor(
    private pcStorageRepository: PcStorageRepository,
    private pokemonService: PokemonService,
  ) {}

  public async update(pcStorage: IPcStorage): Promise<IPcStorage> {
    await this.pokemonService.updateMany(
      pcStorage.storage.map((st) => st.pokemon).filter((pokemon) => !!pokemon),
      pcStorage.gameId,
    );
    return this.pcStorageRepository.update(pcStorage._id, pcStorage);
  }
}
