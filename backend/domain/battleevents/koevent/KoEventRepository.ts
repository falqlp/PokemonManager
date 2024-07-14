import CompleteRepository from "../../CompleteRepository";
import KoEvent, { IKoEvent } from "./KoEvent";
import { singleton } from "tsyringe";
import { EmptyPopulater } from "../../EmptyPopulater";

@singleton()
export default class KoEventRepository extends CompleteRepository<IKoEvent> {
  constructor(populater: EmptyPopulater) {
    super(KoEvent, populater);
  }
}
