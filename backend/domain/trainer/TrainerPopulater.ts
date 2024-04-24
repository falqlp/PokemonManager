import Populater from "../Populater";
import { PopulateOptions } from "mongoose";
import Pokemon from "../pokemon/Pokemon";
import PcStorage from "../pcStorage/PcStorage";
import TrainingCamp from "../trainingCamp/TrainingCamp";
import Nursery from "../nursery/Nursery";
import PokemonPopulater from "../pokemon/PokemonPopulater";
import PcStoragePopulater from "../pcStorage/PcStoragePopulater";
import NurseryPopulater from "../nursery/NurseryPopulater";
import TrainingCampPopulater from "../trainingCamp/TrainingCampPopulater";

class TrainerPopulater extends Populater {
  private static instance: TrainerPopulater;

  public static getInstance(): TrainerPopulater {
    if (!TrainerPopulater.instance) {
      TrainerPopulater.instance = new TrainerPopulater(
        PokemonPopulater.getInstance(),
        PcStoragePopulater.getInstance(),
        NurseryPopulater.getInstance(),
        TrainingCampPopulater.getInstance(),
      );
    }
    return TrainerPopulater.instance;
  }

  constructor(
    protected pokemonPopulater: PokemonPopulater,
    protected pcStoragePopulater: PcStoragePopulater,
    protected nurseryPopulater: NurseryPopulater,
    protected trainingCampPopulater: TrainingCampPopulater,
  ) {
    super();
  }

  public populate(): PopulateOptions | PopulateOptions[] {
    return [
      {
        path: "pokemons",
        model: Pokemon,
        populate: this.pokemonPopulater.populate(),
      },
      {
        path: "pcStorage",
        model: PcStorage,
        populate: this.pcStoragePopulater.populate(),
      },
      {
        path: "trainingCamp",
        model: TrainingCamp,
        populate: this.trainingCampPopulater.populate(),
      },
      {
        path: "nursery",
        model: Nursery,
        populate: this.nurseryPopulater.populate(),
      },
    ];
  }
}

export default TrainerPopulater;
