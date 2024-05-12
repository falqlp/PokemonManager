import { singleton } from "tsyringe";
import UserRepository from "../../domain/user/UserRepository";
import { IUser } from "../../domain/user/User";
import { ObjectId } from "mongodb";
import { MailService } from "../mail/MailService";
import HashService from "./hash/HashService";

@singleton()
export class UserService {
  constructor(
    protected userRepository: UserRepository,
    protected mailService: MailService,
    protected hashService: HashService,
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
    const _id = new ObjectId();
    user._id = _id.toString();
    this.mailService.sendVerifyUser(user);
    return this.userRepository.create({
      ...user,
      _id: _id.toString(),
    });
  }
}
