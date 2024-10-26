import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../../application/user/UserService';

@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      return await this.userService.login(username, password);
    } catch (error) {
      throw error;
    }
  }
}
