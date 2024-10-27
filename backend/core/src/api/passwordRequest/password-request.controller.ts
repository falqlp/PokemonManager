import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PasswordRequestService } from '../../application/user/passwordRequest/PasswordRequestService';
import { PasswordRequestRepository } from '../../domain/user/passwordRequest/PasswordRequestRepository';
import UserMapper from '../user/UserMapper';

@Controller('password-request')
export class PasswordRequestController {
  constructor(
    private readonly service: PasswordRequestService,
    private readonly repository: PasswordRequestRepository,
    private readonly userMapper: UserMapper,
  ) {}

  @Post()
  async createPasswordRequest(
    @Body('username') username: string,
    @Body('email') email: string,
    @Headers('lang') lang: string,
  ) {
    try {
      await this.service.createPasswordRequest(username, email, lang);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to create password request: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getPasswordRequest(@Param('id') id: string) {
    try {
      const obj = await this.repository.get(id);
      obj.user = this.userMapper.map(obj.user);
      return obj;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve password request: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}