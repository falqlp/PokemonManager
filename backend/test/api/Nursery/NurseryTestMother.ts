import { INursery, IWishList } from "../../../api/nursery/Nursery";

export class NurseryTestMother {
  static basicWishList(): IWishList {
    return {
      typeRepartition: {
        bug: 0,
        dark: 10,
        dragon: 0,
        electric: 20,
        fairy: 0,
        fighting: 0,
        fire: 10,
        flying: 0,
        ghost: 0,
        grass: 0,
        ground: 0,
        ice: 0,
        normal: 20,
        poison: 0,
        psy: 10,
        rock: 0,
        steel: 0,
        water: 30,
      },
      quantity: 1,
    };
  }

  static basicNursery(): INursery {
    return {
      level: 1,
      wishList: this.basicWishList(),
      step: "WISHLIST",
    } as INursery;
  }

  static withCustomOptions(options: Partial<INursery>): INursery {
    return {
      ...this.basicNursery(),
      ...options,
    } as INursery;
  }
}
