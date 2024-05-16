import { singleton } from "tsyringe";
import UserRepository from "../../domain/user/UserRepository";
import { IUser } from "../../domain/user/User";
import { MailService } from "../mail/MailService";
import HashService from "./hash/HashService";
import { mongoId } from "../../utils/MongoUtils";
import WebsocketServerService from "../../websocket/WebsocketServerService";

@singleton()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private hashService: HashService,
    private websocketServerService: WebsocketServerService,
  ) {}

  public async create(user: IUser): Promise<IUser> {
    if (user.password) {
      user.password = await this.hashService.hashPassword(user.password);
    }
    if (
      (await this.userRepository.list({ custom: { email: user.email } }))
        .length !== 0
    ) {
      throw new Error("Bad email");
    }
    const _id = mongoId();
    user._id = _id.toString();
    this.mailService.sendVerifyUser(user);
    return this.userRepository.create({
      ...user,
      _id: _id.toString(),
    });
  }

  public addFriend(userId: string, friendId: string): Promise<IUser> {
    this.websocketServerService.notifyUser("NEW_FRIEND_REQUEST", userId);
    return this.userRepository.addFriend(userId, friendId);
  }
}
