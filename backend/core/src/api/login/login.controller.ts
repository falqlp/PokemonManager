import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../../application/user/UserService';
import { IUser } from '../../domain/user/User';

@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<IUser> {
    try {
      return await this.userService.login(username, password);
    } catch (error) {
      throw error;
    }
  }
}
