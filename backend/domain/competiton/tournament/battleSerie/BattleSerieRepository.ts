import { singleton } from "tsyringe";
import BattleSerie, { IBattleSerie } from "./BattleSerie";
import BattleSeriePopulater from "./BattleSeriePopulater";
import CompleteRepository from "../../../CompleteRepository";

@singleton()
export default class BattleSerieRepository extends CompleteRepository<IBattleSerie> {
  constructor(battleSeriePopulater: BattleSeriePopulater) {
    super(BattleSerie, battleSeriePopulater);
  }
}
