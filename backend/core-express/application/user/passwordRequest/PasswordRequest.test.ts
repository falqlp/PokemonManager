import { container } from "tsyringe";
import { PasswordRequestService } from "./PasswordRequestService";
import { PasswordRequestRepository } from "../../../domain/user/passwordRequest/PasswordRequestRepository";
import UserRepository from "../../../domain/user/UserRepository";
import { MailService } from "../../mail/MailService";
import { IUser } from "../../../domain/user/User";

describe("PasswordRequestService", () => {
  let passwordRequestService: PasswordRequestService;
  let userRepository: UserRepository;
  let passwordRequestRepository: PasswordRequestRepository;
  let mailService: MailService;

  beforeEach(() => {
    passwordRequestService = container.resolve(PasswordRequestService);
    userRepository = container.resolve(UserRepository);
    passwordRequestRepository = container.resolve(PasswordRequestRepository);
    mailService = container.resolve(MailService);
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe("createPasswordRequest", () => {
    it("should create a password request and send an email if user exists", async () => {
      const username = "testuser";
      const email = "test@example.com";
      const lang = "en";
      const user: IUser = { _id: "userId", username, email } as IUser;
      const passwordRequest = {
        _id: "requestId",
        user,
        expirationDate: new Date(),
      };
      jest.spyOn(userRepository, "list").mockResolvedValue([user]);
      jest
        .spyOn(passwordRequestRepository, "create")
        .mockResolvedValue(passwordRequest);
      jest.spyOn(mailService, "sendModifyPassword").mockReturnValue();

      await passwordRequestService.createPasswordRequest(username, email, lang);

      expect(userRepository.list).toHaveBeenCalledWith({
        custom: { username, email },
      });
      expect(passwordRequestRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user,
          expirationDate: expect.any(Date),
        }),
      );
      expect(mailService.sendModifyPassword).toHaveBeenCalledWith(
        passwordRequest._id.toString(),
        user,
        lang,
      );
    });

    it("should not create a password request if user does not exist", async () => {
      const username = "testuser";
      const email = "test@example.com";
      const lang = "en";
      jest.spyOn(userRepository, "list").mockResolvedValue([]);
      jest.spyOn(passwordRequestRepository, "create");
      jest.spyOn(mailService, "sendModifyPassword");

      await passwordRequestService.createPasswordRequest(username, email, lang);

      expect(userRepository.list).toHaveBeenCalledWith({
        custom: { username, email },
      });
      expect(passwordRequestRepository.create).toHaveBeenCalledTimes(0);
      expect(mailService.sendModifyPassword).toHaveBeenCalledTimes(0);
    });
  });
});
