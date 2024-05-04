import { singleton } from "tsyringe";
import { createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/smtp-pool";
import dotenv from "dotenv";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import fs from "fs";
import path from "node:path";
import { IUser } from "../../domain/user/User";

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

  public sendVerifyUser(user: IUser, lang: string): void {
    let content = fs.readFileSync(
      path.join(__dirname.replace("\\dist", ""), lang + "/verify-mail.html"),
      "utf-8",
    );
    content = content.replace("username", user.username);
    content = content.replace(
      "link",
      `${process.env.FRONT_URL}/verify-email/${user._id}`,
    );
    const mailOptions: MailOptions = {
      from: this.mail,
      to: user.email,
      subject:
        lang === "fr" ? "Vérification du compte" : "Account verification",
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
    let content = fs.readFileSync(
      path.join(
        __dirname.replace("\\dist", ""),
        lang + "/modify-password.html",
      ),
      "utf-8",
    );
    content = content.replace("username", user.username);
    content = content.replace(
      "link",
      `${process.env.FRONT_URL}/change-password/${passwordRequestId}`,
    );
    const mailOptions: MailOptions = {
      from: this.mail,
      to: user.email,
      subject: lang === "fr" ? "Changement de mot de passe" : "Password change",
      html: content,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail: ", error);
      }
    });
  }
}
