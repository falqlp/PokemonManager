import { Test, TestingModule } from '@nestjs/testing';
import { mongoId } from 'shared/utils/MongoUtils';
import { IUser } from '../../domain/user/User';
import UserRepository from '../../domain/user/UserRepository';
import { MailService } from '../mail/MailService';
import { UserService } from './UserService';
import { PasswordRequestRepository } from '../../domain/user/passwordRequest/PasswordRequestRepository';
import HashService from './hash/HashService';
import WebsocketUtils from '../../websocket/WebsocketUtils';

jest.mock('shared/utils/MongoUtils');
jest.mock('./hash/HashService');
jest.mock('../../websocket/WebsocketUtils');
jest.mock('../mail/MailService');
jest.mock('../../domain/user/passwordRequest/PasswordRequestRepository');
jest.mock('../../domain/user/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let mailService: MailService;
  let hashService: HashService;
  let websocketUtils: WebsocketUtils;
  let passwordRequestRepository: PasswordRequestRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        MailService,
        HashService,
        WebsocketUtils,
        PasswordRequestRepository,
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    mailService = module.get<MailService>(MailService);
    hashService = module.get<HashService>(HashService);
    passwordRequestRepository = module.get<PasswordRequestRepository>(
      PasswordRequestRepository,
    );
    websocketUtils = module.get<WebsocketUtils>(WebsocketUtils);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash the password and create a new user', async () => {
      const user: IUser = {
        email: 'test@example.com',
        password: 'password123',
      } as IUser;
      const hashedPassword = 'hashedPassword123';
      const userId = 'generatedUserId';

      jest.spyOn(hashService, 'hashPassword').mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'list').mockResolvedValue([]);
      jest.spyOn(mailService, 'sendVerifyUser');
      jest.spyOn(userRepository, 'create').mockResolvedValue({
        ...user,
        password: hashedPassword,
        _id: userId,
      });
      (mongoId as jest.Mock).mockReturnValue({ toString: () => userId });
      const result = await userService.create(user);

      expect(hashService.hashPassword).toHaveBeenCalledWith('password123');
      expect(userRepository.list).toHaveBeenCalledWith({
        custom: { email: 'test@example.com' },
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

    it('should throw an error if email already exists', async () => {
      const user: IUser = { email: 'test@example.com' } as IUser;
      jest.spyOn(userRepository, 'list').mockResolvedValue([user]);

      await expect(userService.create(user)).rejects.toThrow('Bad email');
      expect(hashService.hashPassword).not.toHaveBeenCalled();
      expect(mongoId).not.toHaveBeenCalled();
      expect(mailService.sendVerifyUser).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('addFriend', () => {
    it('should notify the user and add a friend', async () => {
      jest.spyOn(userRepository, 'addFriend').mockResolvedValue();
      const websocketSpy = jest
        .spyOn(websocketUtils, 'notifyUser')
        .mockReturnValue();
      const userId = 'userId';
      const friendId = 'friendId';

      await userService.addFriend(userId, friendId);

      expect(websocketSpy).toHaveBeenCalledWith('NEW_FRIEND_REQUEST', userId);
      expect(userRepository.addFriend).toHaveBeenCalledWith(userId, friendId);
    });
  });

  describe('changeLanguage', () => {
    it('should change the language of the user', async () => {
      const userId = 'userId';
      const lang = 'fr';
      const user: IUser = { _id: userId, lang: 'en' } as IUser;

      jest.spyOn(userRepository, 'get').mockResolvedValue(user);
      jest.spyOn(userRepository, 'update').mockResolvedValue(user);

      await userService.changeLanguage(userId, lang);

      expect(userRepository.get).toHaveBeenCalledWith(userId);
      expect(user.lang).toBe(lang);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
    });

    it('should not change the language if user is not found', async () => {
      const userId = 'userId';
      const lang = 'fr';
      jest.spyOn(userRepository, 'update');
      jest.spyOn(userRepository, 'get').mockResolvedValue(null);

      await userService.changeLanguage(userId, lang);

      expect(userRepository.get).toHaveBeenCalledWith(userId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('verifyMail', () => {
    it("should verify the user's email", async () => {
      const userId = 'userId';
      const user: IUser = { _id: userId, verified: false } as IUser;

      jest.spyOn(userRepository, 'get').mockResolvedValue(user);
      jest.spyOn(userRepository, 'update').mockResolvedValue(user);

      await userService.verifyMail(userId);

      expect(userRepository.get).toHaveBeenCalledWith(userId);
      expect(user.verified).toBe(true);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
    });

    it('should not verify the email if user is not found', async () => {
      const userId = 'userId';
      jest.spyOn(userRepository, 'get').mockResolvedValue(null);
      jest.spyOn(userRepository, 'update');
      await userService.verifyMail(userId);

      expect(userRepository.get).toHaveBeenCalledWith(userId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('acceptFriendRequest', () => {
    it('should accept a friend request', async () => {
      const userId = 'userId';
      const friendId = 'friendId';
      const user: IUser = {
        _id: userId,
        friendRequest: [{ _id: friendId }],
        friends: [],
      } as IUser;
      const friend: IUser = { _id: friendId, friends: [] } as IUser;

      jest
        .spyOn(userRepository, 'get')
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(friend);
      jest.spyOn(userRepository, 'update').mockResolvedValue(user);

      await userService.acceptFriendRequest(userId, friendId);

      expect(user.friends).toContainEqual(friend);
      expect(friend.friends).toContainEqual(user);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
      expect(userRepository.update).toHaveBeenCalledWith(friendId, friend);
    });

    it('should not accept friend request if user or friend is not found', async () => {
      const userId = 'userId';
      const friendId = 'friendId';

      jest
        .spyOn(userRepository, 'get')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'update');
      await userService.acceptFriendRequest(userId, friendId);

      expect(userRepository.get).toHaveBeenCalledWith(userId);
      expect(userRepository.get).toHaveBeenCalledWith(friendId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteFriendRequest', () => {
    it('should delete a friend request', async () => {
      const userId = 'userId';
      const friendId = 'friendId';
      const user: IUser = {
        _id: userId,
        friendRequest: [{ _id: friendId }],
      } as IUser;
      const friend: IUser = { _id: friendId } as IUser;

      jest
        .spyOn(userRepository, 'get')
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(friend);
      jest.spyOn(userRepository, 'update').mockResolvedValue(user);

      await userService.deleteFriendRequest(userId, friendId);

      expect(user.friendRequest).not.toContainEqual(friend);
      expect(userRepository.update).toHaveBeenCalledWith(userId, user);
    });

    it('should not delete friend request if user or friend is not found', async () => {
      const userId = 'userId';
      const friendId = 'friendId';

      jest
        .spyOn(userRepository, 'get')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'update');
      await userService.deleteFriendRequest(userId, friendId);

      expect(userRepository.get).toHaveBeenCalledWith(userId);
      expect(userRepository.get).toHaveBeenCalledWith(friendId);
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should change the password if the password request is valid', async () => {
      const password = 'newPassword';
      const passwordRequestId = 'passwordRequestId';
      const passwordRequest = {
        _id: passwordRequestId,
        user: { _id: 'userId' } as IUser,
        expirationDate: new Date(Date.now() + 10000),
      };

      jest
        .spyOn(passwordRequestRepository, 'get')
        .mockResolvedValue(passwordRequest);
      jest.spyOn(userRepository, 'update').mockResolvedValue(null);

      await userService.changePassword(password, passwordRequestId);

      expect(userRepository.update).toHaveBeenCalledWith(
        passwordRequest.user._id,
        { password },
      );
    });

    it('should not change the password if the password request is expired', async () => {
      const password = 'newPassword';
      const passwordRequestId = 'passwordRequestId';
      const passwordRequest = {
        _id: passwordRequestId,
        user: { _id: 'userId' } as IUser,
        expirationDate: new Date(Date.now() - 10000),
      };

      jest
        .spyOn(passwordRequestRepository, 'get')
        .mockResolvedValue(passwordRequest);
      jest.spyOn(userRepository, 'update');
      await userService.changePassword(password, passwordRequestId);

      expect(passwordRequestRepository.get).toHaveBeenCalledWith(
        passwordRequestId,
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should not change the password if the password request is not found', async () => {
      const password = 'newPassword';
      const passwordRequestId = 'passwordRequestId';
      jest.spyOn(userRepository, 'update');
      jest.spyOn(passwordRequestRepository, 'get').mockResolvedValue(null);

      await userService.changePassword(password, passwordRequestId);
      jest.spyOn(userRepository, 'update');
      expect(passwordRequestRepository.get).toHaveBeenCalledWith(
        passwordRequestId,
      );
      expect(userRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('readNews', () => {
    it('should mark news as read for the user', async () => {
      const userId = 'userId';
      jest.spyOn(userRepository, 'update').mockResolvedValue(null);

      await userService.readNews(userId);

      expect(userRepository.update).toHaveBeenCalledWith(userId, {
        hasReadNews: true,
      });
    });
  });
});
