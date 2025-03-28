import { Injectable } from '@nestjs/common';
import { PasswordRequestRepository } from '../../../domain/user/passwordRequest/PasswordRequestRepository';
import UserRepository from '../../../domain/user/UserRepository';
import { MailService } from '../../mail/MailService';

@Injectable()
export class PasswordRequestService {
  constructor(
    protected passwordRequestRepository: PasswordRequestRepository,
    protected userRepository: UserRepository,
    protected mailService: MailService,
  ) {}

  public async createPasswordRequest(
    username: string,
    email: string,
    lang: string,
  ): Promise<void> {
    const user = await this.userRepository.list({
      custom: { username, email },
    });
    if (user.length === 1 && user[0]) {
      const expirationDate = new Date(Date.now() + 15 * 60 * 1000);
      const passwordRequest = await this.passwordRequestRepository.create({
        user: user[0],
        expirationDate,
      });
      this.mailService.sendModifyPassword(
        passwordRequest._id.toString(),
        user[0],
        lang,
      );
    }
  }
}
