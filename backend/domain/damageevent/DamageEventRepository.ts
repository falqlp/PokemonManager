import CompleteRepository from "../CompleteRepository";
import DamageEvent, { IDamageEvent } from "./DamageEvent";
import DamageEventPopulater from "./DamageEventPopulater";
import { singleton } from "tsyringe";

@singleton()
export default class DamageEventRepository extends CompleteRepository<IDamageEvent> {
  constructor(populater: DamageEventPopulater) {
    super(DamageEvent, populater);
  }
}
