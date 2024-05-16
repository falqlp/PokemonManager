import CompleteRepository from "../CompleteRepository";
import User, { IUser } from "./User";
import HashService from "../../application/user/hash/HashService";
import UserPopulater from "./UserPopulater";
import { singleton } from "tsyringe";
import { ListBody } from "../ReadOnlyRepository";

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

  public async list(
    body: ListBody,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: {
      gameId?: string;
      lang?: string;
      map?: (entity: IUser) => Promise<IUser> | IUser;
    },
  ): Promise<IUser[]> {
    return super.list(body);
  }

  public addFriend(userId: string, friendId: string): Promise<IUser> {
    return this.schema.findByIdAndUpdate(
      userId,
      { $push: { friendRequest: friendId } },
      { new: true },
    );
  }

  public getByUsername(username: string): Promise<IUser> {
    return this.schema.findOne({ username });
  }

  public async update(_id: string, dto: IUser): Promise<IUser> {
    if (dto.password) {
      dto.password = await this.hashService.hashPassword(dto.password);
    }
    dto.friendRequest = dto.friendRequest ?? [];
    dto.friends = dto.friends ?? [];
    return super.update(_id, dto);
  }
}

export default UserRepository;
