import { INursery, IWishList } from "../../../domain/trainer/nursery/Nursery";
import { IPokemon } from "../../../domain/pokemon/Pokemon";
import NurseryRepository from "../../../domain/trainer/nursery/NurseryRepository";
import PokemonService from "../../pokemon/PokemonService";
import { singleton } from "tsyringe";
import TrainerRepository from "../../../domain/trainer/TrainerRepository";
import { Error } from "mongoose";
import calendarEventService from "../../calendarEvent/CalendarEventService";

@singleton()
export default class NurseryService {
  constructor(
    protected nurseryRepository: NurseryRepository,
    protected pokemonService: PokemonService,
    private trainerRepository: TrainerRepository,
    private calendarEventService: calendarEventService,
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

  public async setNurseryWishlist(
    nurseryId: string,
    wishlist: IWishList,
    gameId: string,
    trainerId: string,
  ): Promise<void> {
    const nursery = await this.nurseryRepository.get(nurseryId, { gameId });
    const trainer = await this.trainerRepository.get(trainerId, { gameId });
    if (trainer?.nursery?._id === nurseryId && nursery?.step === "WISHLIST") {
      nursery.step = "FIRST_SELECTION";
      nursery.wishList = wishlist;
      await this.nurseryRepository.update(nurseryId, nursery);
      await this.calendarEventService.createNurseryEvent(gameId, trainer);
    } else {
      throw new Error("Unauthorized");
    }
  }

  public async saveNurseryWishlist(
    nurseryId: string,
    wishlist: IWishList,
    gameId: string,
  ): Promise<void> {
    const nursery = await this.nurseryRepository.get(nurseryId, { gameId });
    if (nursery) {
      nursery.wishList = wishlist;
      await this.nurseryRepository.update(nurseryId, nursery);
    } else {
      throw new Error("Unauthorized");
    }
  }
}
