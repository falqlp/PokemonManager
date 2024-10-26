import {
  IPcStorage,
  IPcStorageStorage,
} from '../../../domain/trainer/pcStorage/PcStorage';
import { PokemonTestMother } from '../pokemon/PokemonTestMother';

export class PcStorageTestMother {
  private static readonly MAX_SIZE = 36;
  static basicPcStorageStorage(): IPcStorageStorage {
    return {
      pokemon: PokemonTestMother.generateBulbasaur(),
      position: 1,
    };
  }

  static basicPcStorage(): IPcStorage {
    return {
      maxSize: 30,
      storage: [this.basicPcStorageStorage()],
    } as IPcStorage;
  }

  static withCustomOptions(options: Partial<IPcStorage>): IPcStorage {
    const basicStorage = this.basicPcStorage();
    return {
      ...basicStorage,
      ...options,
      storage: options.storage || basicStorage.storage,
    } as IPcStorage;
  }

  static filledPcStorage(): IPcStorage {
    const storage: IPcStorageStorage[] = [];
    for (let i = 0; i < this.MAX_SIZE; i++) {
      storage.push({
        pokemon: PokemonTestMother.withCustomOptions({
          nickname: `Pokemon ${i}`,
        }),
        position: i + 1,
      });
    }
    return {
      maxSize: this.MAX_SIZE,
      storage: storage,
    } as IPcStorage;
  }
}
