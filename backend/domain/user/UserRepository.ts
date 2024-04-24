import CompleteRepository from "../CompleteRepository";
import User, { IUser } from "./User";
import HashService from "../../application/hash/HashService";
import UserPopulater from "./UserPopulater";
import { singleton } from "tsyringe";

@singleton()
class UserRepository extends CompleteRepository<IUser> {
  constructor(
    protected hashService: HashService,
    userPopulater: UserPopulater,
  ) {
    super(User, userPopulater);
  }

  public get(
    _id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: {
      gameId?: string;
      map?: (entity: IUser) => IUser | Promise<IUser>;
    },
  ): Promise<IUser> {
    return super.get(_id);
  }

  public async update(_id: string, dto: IUser): Promise<IUser> {
    if (dto.password) {
      dto.password = await this.hashService.hashPassword(dto.password);
    }
    return super.update(_id, dto);
  }
}

export default UserRepository;
