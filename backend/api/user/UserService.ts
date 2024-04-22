import CompleteService from "../CompleteService";
import User, { IUser } from "./User";
import UserMapper from "./UserMapper";

class UserService extends CompleteService<IUser> {
  private static instance: UserService;
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(User, UserMapper.getInstance());
    }
    return UserService.instance;
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

export default UserService;
