import CompleteRepository from "../../CompleteRepository";
import BattleParticipationEvent, {
  IBattleParticipationEvent,
} from "./BattleParticipationEvent";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../../EmptyPopulater";

@singleton()
export default class BattleParticipationEventRepository extends CompleteRepository<IBattleParticipationEvent> {
  constructor(populater: EmptyPopulater) {
    super(BattleParticipationEvent, populater);
  }
}
