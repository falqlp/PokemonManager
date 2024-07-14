import { container } from "tsyringe";
import UserRepository from "../../domain/user/UserRepository";
import { IUser } from "../../domain/user/User";
import { MailService } from "../mail/MailService";
import HashService from "./hash/HashService";
import { mongoId } from "../../utils/MongoUtils";
import WebsocketUtils from "../../websocket/WebsocketUtils";
import { UserService } from "./UserService";
import { PasswordRequestRepository } from "../../domain/user/passwordRequest/PasswordRequestRepository";
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
  describe("changeLanguage", () => {
    let getUserSpy: jest.SpyInstance;
    beforeEach(() => {
      getUserSpy = jest.spyOn(userRepository, "get");
    });
    it("should change the language of the user", async () => {
      const userId = "userId";
      const lang = "fr";
      const user: IUser = { _id: userId, lang: "en" } as IUser;

      getUserSpy.mockResolvedValue(user);
      jest.spyOn(userRepository, "update").mockResolvedValue(user);

      await userService.changeLanguage(userId, lang);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(user.lang).toBe(lang);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
    });

    it("should not change the language if user is not found", async () => {
      const userId = "userId";
      const lang = "fr";
      jest.spyOn(userRepository, "update");
      getUserSpy.mockResolvedValue(null);

      await userService.changeLanguage(userId, lang);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("verifyMail", () => {
    let getUserSpy: jest.SpyInstance;
    beforeEach(() => {
      getUserSpy = jest.spyOn(userRepository, "get");
    });
    it("should verify the user's email", async () => {
      const userId = "userId";
      const user: IUser = { _id: userId, verified: false } as IUser;

      getUserSpy.mockResolvedValue(user);
      jest.spyOn(userRepository, "update").mockResolvedValue(user);

      await userService.verifyMail(userId);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(user.verified).toBe(true);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
    });

    it("should not verify the email if user is not found", async () => {
      const userId = "userId";

      getUserSpy.mockResolvedValue(null);
      jest.spyOn(userRepository, "update");
      await userService.verifyMail(userId);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("acceptFriendRequest", () => {
    let getUserSpy: jest.SpyInstance;
    beforeEach(() => {
      getUserSpy = jest.spyOn(userRepository, "get");
    });
    it("should accept a friend request", async () => {
      const userId = "userId";
      const friendId = "friendId";
      const user: IUser = {
        _id: userId,
        friendRequest: [{ _id: friendId }],
        friends: [],
      } as IUser;
      const friend: IUser = { _id: friendId, friends: [] } as IUser;

      getUserSpy.mockResolvedValueOnce(user).mockResolvedValueOnce(friend);
      jest.spyOn(userRepository, "update").mockResolvedValue(user);

      await userService.acceptFriendRequest(userId, friendId);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(getUserSpy).toHaveBeenCalledWith(friendId);
      expect(user.friends).toContainEqual(friend);
      expect(friend.friends).toContainEqual(user);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
      expect(userRepository.update).toHaveBeenCalledWith(friendId, friend);
    });

    it("should not accept friend request if user or friend is not found", async () => {
      const userId = "userId";
      const friendId = "friendId";

      getUserSpy.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      jest.spyOn(userRepository, "update");
      await userService.acceptFriendRequest(userId, friendId);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(getUserSpy).toHaveBeenCalledWith(friendId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteFriendRequest", () => {
    let getUserSpy: jest.SpyInstance;
    beforeEach(() => {
      getUserSpy = jest.spyOn(userRepository, "get");
    });
    it("should delete a friend request", async () => {
      const userId = "userId";
      const friendId = "friendId";
      const user: IUser = {
        _id: userId,
        friendRequest: [{ _id: friendId }],
      } as IUser;
      const friend: IUser = { _id: friendId } as IUser;

      getUserSpy.mockResolvedValueOnce(user).mockResolvedValueOnce(friend);
      jest.spyOn(userRepository, "update").mockResolvedValue(user);

      await userService.deleteFriendRequest(userId, friendId);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(getUserSpy).toHaveBeenCalledWith(friendId);
      expect(user.friendRequest).not.toContainEqual(friend);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
    });

    it("should not delete friend request if user or friend is not found", async () => {
      const userId = "userId";
      const friendId = "friendId";

      getUserSpy.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      jest.spyOn(userRepository, "update");
      await userService.deleteFriendRequest(userId, friendId);

      expect(getUserSpy).toHaveBeenCalledWith(userId);
      expect(getUserSpy).toHaveBeenCalledWith(friendId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("changePassword", () => {
    let passwordRequestRepository: PasswordRequestRepository;
    let getPasswoardRequestSpy: jest.SpyInstance;
    beforeEach(() => {
      passwordRequestRepository = container.resolve(PasswordRequestRepository);
      getPasswoardRequestSpy = jest.spyOn(passwordRequestRepository, "get");
    });
    it("should change the password if the password request is valid", async () => {
      const password = "newPassword";
      const passwordRequestId = "passwordRequestId";
      const passwordRequest = {
        _id: passwordRequestId,
        user: { _id: "userId" },
        expirationDate: new Date(Date.now() + 10000),
      };

      getPasswoardRequestSpy.mockResolvedValue(passwordRequest);
      jest.spyOn(userRepository, "update").mockResolvedValue(null);

      await userService.changePassword(password, passwordRequestId);

      expect(getPasswoardRequestSpy).toHaveBeenCalledWith(passwordRequestId);
      expect(userRepository.update).toHaveBeenCalledWith(
        passwordRequest.user._id,
        { password },
      );
    });

    it("should not change the password if the password request is expired", async () => {
      const password = "newPassword";
      const passwordRequestId = "passwordRequestId";
      const passwordRequest = {
        _id: passwordRequestId,
        user: { _id: "userId" },
        expirationDate: new Date(Date.now() - 10000),
      };

      getPasswoardRequestSpy.mockResolvedValue(passwordRequest);
      jest.spyOn(userRepository, "update");
      await userService.changePassword(password, passwordRequestId);

      expect(getPasswoardRequestSpy).toHaveBeenCalledWith(passwordRequestId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it("should not change the password if the password request is not found", async () => {
      const password = "newPassword";
      const passwordRequestId = "passwordRequestId";
      jest.spyOn(userRepository, "update");
      getPasswoardRequestSpy.mockResolvedValue(null);

      await userService.changePassword(password, passwordRequestId);
      jest.spyOn(userRepository, "update");
      expect(getPasswoardRequestSpy).toHaveBeenCalledWith(passwordRequestId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("readNews", () => {
    it("should mark news as read for the user", async () => {
      const userId = "userId";
      jest.spyOn(userRepository, "update").mockResolvedValue(null);

      await userService.readNews(userId);

      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        hasReadNews: true,
      });
    });
  });
});
