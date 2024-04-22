import * as bcrypt from "bcryptjs";
import { IUser } from "../../api/user/User";

class HashService {
  private static readonly saltRounds = 10;

  private static instance: HashService;

  public static getInstance(): HashService {
    if (!HashService.instance) {
      HashService.instance = new HashService();
    }
    return HashService.instance;
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, HashService.saltRounds);
  }

  public async checkPassword(
    user: IUser,
    inputPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, user.password);
  }
}

export default HashService;
