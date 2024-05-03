import { singleton } from "tsyringe";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-pool";
import dotenv from "dotenv";

dotenv.config();

@singleton()
export class MailService {
  private transporter;
  private mail = "playpokemonmanager@gmail.com";
  constructor() {
    this.transporter = createTransport({
      service: "gmail",
      auth: {
        user: this.mail,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public sendVerifyUser(userId: string, mail: string): void {
    const mailOptions: MailOptions = {
      from: this.mail,
      to: mail,
      subject: "Verify email",
      html: `<a href="${process.env.FRONT_URL}/verify-email/${userId}">Verify</a>`,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail: ", error);
      }
    });
  }

  public sendModifyPassword(passwordRequestId: string, mail: string): void {
    const mailOptions: MailOptions = {
      from: this.mail,
      to: mail,
      subject: "Change password",
      html: `<a href="${process.env.FRONT_URL}/change-password/${passwordRequestId}">Change password</a>`,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail: ", error);
      }
    });
  }
}
