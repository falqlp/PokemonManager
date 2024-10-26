import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MailService } from '../../application/mail/MailService';

@Controller('email')
export class EmailController {
  constructor(private readonly mailService: MailService) {}

  @Post('contact-us')
  contactUs(
    @Body('subject') subject: string,
    @Body('details') details: string,
    @Body('userId') userId: string,
  ) {
    try {
      this.mailService.contactUs(subject, details, userId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to send contact email: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
