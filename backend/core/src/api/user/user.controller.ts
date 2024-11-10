import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import UserRepository from '../../domain/user/UserRepository';
import UserMapper from './UserMapper';
import { UserService } from '../../application/user/UserService';
import { ReadOnlyController } from 'shared/common/api/read-only.controller';
import { IUser } from '../../domain/user/User';

@Controller('user')
export class UserController extends ReadOnlyController<IUser> {
  constructor(
    protected readonly service: UserRepository,
    protected readonly mapper: UserMapper,
    private readonly userService: UserService,
  ) {
    super(service, mapper);
  }

  @Post()
  public async createUser(@Body() body: IUser): Promise<IUser> {
    try {
      return await this.userService.create(body);
    } catch (error: any) {
      if (error.message === 'Bad email') {
        throw new HttpException(
          { message: 'EMAIL_ALREADY_USED' },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(
          'Failed to create user: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Put('add-friend')
  public async addFriend(
    @Body('userId') userId: string,
    @Body('friendId') friendId: string,
  ): Promise<{ status: string }> {
    try {
      await this.userService.addFriend(userId, friendId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to add friend: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('change-language')
  public async changeLanguage(
    @Body('userId') userId: string,
    @Body('lang') lang: string,
  ): Promise<{ status: string }> {
    try {
      await this.userService.changeLanguage(userId, lang);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to change language: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('verify')
  public async verifyMail(
    @Body('userId') userId: string,
  ): Promise<{ status: string }> {
    try {
      await this.userService.verifyMail(userId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to verify email: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('accept-friend-request')
  public async acceptFriendRequest(
    @Body('userId') userId: string,
    @Body('friendId') friendId: string,
  ): Promise<{ status: string }> {
    try {
      await this.userService.acceptFriendRequest(userId, friendId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to accept friend request: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('delete-friend-request')
  public async deleteFriendRequest(
    @Body('userId') userId: string,
    @Body('friendId') friendId: string,
  ): Promise<{ status: string }> {
    try {
      await this.userService.deleteFriendRequest(userId, friendId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete friend request: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('change-password')
  public async changePassword(
    @Body('password') password: string,
    @Body('passwordRequestId') passwordRequestId: string,
  ): Promise<{ status: string }> {
    try {
      await this.userService.changePassword(password, passwordRequestId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to change password: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('read-news')
  public async readNews(
    @Body('userId') userId: string,
  ): Promise<{ status: string }> {
    try {
      await this.userService.readNews(userId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to read news: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('is-email-used')
  public async isEmailUsed(@Body('email') email: string): Promise<boolean> {
    try {
      const obj = await this.service.list({ custom: { email } });
      return obj.length > 0;
    } catch (error) {
      throw new HttpException(
        'Failed to check email usage: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('is-username-used')
  public async isUsernameUsed(
    @Body('username') username: string,
  ): Promise<boolean> {
    try {
      const obj = await this.service.list({ custom: { username } });
      return obj.length > 0;
    } catch (error) {
      throw new HttpException(
        'Failed to check username usage: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
