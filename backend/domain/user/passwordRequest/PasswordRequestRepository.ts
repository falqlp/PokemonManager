import CompleteRepository from "../../CompleteRepository";
import PasswordRequest, { IPasswordRequest } from "./PasswordRequest";
import { PasswordRequestPopulater } from "./PasswordRequestPopulater";
import { singleton } from "tsyringe";

@singleton()
export class PasswordRequestRepository extends CompleteRepository<IPasswordRequest> {
  constructor(passwordRequestPopulater: PasswordRequestPopulater) {
    super(PasswordRequest, passwordRequestPopulater);
  }
}
