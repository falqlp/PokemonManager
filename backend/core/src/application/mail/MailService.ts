import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/smtp-pool';
import { IUser } from '../../domain/user/User';
import { modifyPasswordHtmlFR } from './fr-FR/modify-password.html';
import { verifyMailHtmlFR } from './fr-FR/verify-mail.html';
import { verifyMailHtmlEN } from './en-EN/verify-mail.html';
import { modifyPasswordHtmlEN } from './en-EN/modify-password.html';

@Injectable()
export class MailService {
  private transporter;
  private mail = 'playpokemonmanager@gmail.com';
  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: this.mail,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public sendVerifyUser(user: IUser): void {
    let content = user.lang === 'fr-FR' ? verifyMailHtmlFR : verifyMailHtmlEN;
    content = content.replace('username', user.username);
    content = content.replace(
      'link',
      `${process.env.FRONT_URL}/verify-email/${user._id}`,
    );
    const mailOptions: MailOptions = {
      from: this.mail,
      to: user.email,
      subject:
        user.lang === 'fr-Fr'
          ? 'Vérification du compte'
          : 'Account verification',
      html: content,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail: ", error);
      }
    });
  }

  public sendModifyPassword(
    passwordRequestId: string,
    user: IUser,
    lang: string,
  ): void {
    let content =
      user.lang === 'fr-FR' ? modifyPasswordHtmlFR : modifyPasswordHtmlEN;
    content = content.replace('username', user.username);
    content = content.replace(
      'link',
      `${process.env.FRONT_URL}/change-password/${passwordRequestId}`,
    );
    const mailOptions: MailOptions = {
      from: this.mail,
      to: user.email,
      subject: lang === 'fr' ? 'Changement de mot de passe' : 'Password change',
      html: content,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail: ", error);
      }
    });
  }

  public contactUs(subject: string, details: string, userId: string): void {
    const mailOptions: MailOptions = {
      from: this.mail,
      to: this.mail,
      subject: `[${userId}]: ${subject}`,
      text: details,
    };
    this.transporter.sendMail(mailOptions);
  }
}
