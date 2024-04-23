import CompleteRepository from "../CompleteRepository";
import User, { IUser } from "./User";
import UserMapper from "./UserMapper";

class UserRepository extends CompleteRepository<IUser> {
  private static instance: UserRepository;
  public static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository(
        User,
        UserMapper.getInstance(),
      );
    }
    return UserRepository.instance;
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
}

export default UserRepository;
