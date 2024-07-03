import { container } from "tsyringe";
import UserRepository from "../../domain/user/UserRepository";
import { IUser } from "../../domain/user/User";
import { MailService } from "../mail/MailService";
import HashService from "./hash/HashService";
import { mongoId } from "../../utils/MongoUtils";
import WebsocketUtils from "../../websocket/WebsocketUtils";
import { UserService } from "./UserService";
jest.mock("../../utils/MongoUtils");

describe("UserService", () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let mailService: MailService;
  let hashService: HashService;
  let websocketUtils: WebsocketUtils;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    userService = container.resolve(UserService);
    userRepository = container.resolve(UserRepository);
    mailService = container.resolve(MailService);
    hashService = container.resolve(HashService);
    websocketUtils = container.resolve(WebsocketUtils);
  });

  describe("create", () => {
    it("should hash the password and create a new user", async () => {
      const user: IUser = {
        email: "test@example.com",
        password: "password123",
      } as IUser;
      const hashedPassword = "hashedPassword123";
      const userId = "generatedUserId";
      jest.spyOn(hashService, "hashPassword").mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, "list").mockResolvedValue([]);
      jest.spyOn(mailService, "sendVerifyUser");
      jest.spyOn(userRepository, "create").mockResolvedValue({
        ...user,
        password: hashedPassword,
        _id: userId,
      });
      (mongoId as jest.Mock).mockReturnValue({ toString: () => userId });

      const result = await userService.create(user);

      expect(hashService.hashPassword).toHaveBeenCalledWith("password123");
      expect(userRepository.list).toHaveBeenCalledWith({
        custom: { email: "test@example.com" },
      });
      expect(mongoId).toHaveBeenCalled();
      expect(mailService.sendVerifyUser).toHaveBeenCalledWith(
        expect.objectContaining({ ...user, _id: userId }),
      );
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...user,
          password: hashedPassword,
          _id: userId,
        }),
      );
      expect(result).toEqual({
        ...user,
        password: hashedPassword,
        _id: userId,
      });
    });

    it("should throw an error if email already exists", async () => {
      const user: IUser = {
        email: "test@example.com",
      } as IUser;

      jest.spyOn(userRepository, "list").mockResolvedValue([user]);
      jest.spyOn(userRepository, "create");
      jest.spyOn(hashService, "hashPassword");
      jest.spyOn(mailService, "sendVerifyUser");

      await expect(userService.create(user)).rejects.toThrow("Bad email");

      expect(hashService.hashPassword).not.toHaveBeenCalled();
      expect(mongoId).not.toHaveBeenCalled();
      expect(mailService.sendVerifyUser).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("addFriend", () => {
    it("should notify the user and add a friend", async () => {
      jest.spyOn(userRepository, "addFriend").mockResolvedValue();
      const websocketSpy = jest
        .spyOn(websocketUtils, "notifyUser")
        .mockReturnValue();
      const userId = "userId";
      const friendId = "friendId";

      await userService.addFriend(userId, friendId);

      expect(websocketSpy).toHaveBeenCalledWith("NEW_FRIEND_REQUEST", userId);
      expect(userRepository.addFriend).toHaveBeenCalledWith(userId, friendId);
    });
  });
});
