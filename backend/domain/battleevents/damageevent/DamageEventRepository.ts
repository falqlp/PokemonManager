import CompleteRepository from "../../CompleteRepository";
import DamageEvent, { IDamageEvent } from "./DamageEvent";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../../EmptyPopulater";

@singleton()
export default class DamageEventRepository extends CompleteRepository<IDamageEvent> {
  constructor(populater: EmptyPopulater) {
    super(DamageEvent, populater);
  }
}
