import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UserRepository from '../../domain/user/UserRepository';
import { IUser } from '../../domain/user/User';
import { MailService } from '../mail/MailService';
import HashService from './hash/HashService';
import { mongoId } from 'shared/utils/MongoUtils';
import WebsocketUtils from '../../websocket/WebsocketUtils';
import { PasswordRequestRepository } from '../../domain/user/passwordRequest/PasswordRequestRepository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private hashService: HashService,
    private websocketUtils: WebsocketUtils,
    private passwordRequestRepository: PasswordRequestRepository,
  ) {}

  public async create(user: IUser): Promise<IUser> {
    if (user.password) {
      user.password = await this.hashService.hashPassword(user.password);
    }
    if (
      (await this.userRepository.list({ custom: { email: user.email } }))
        .length !== 0
    ) {
      throw new Error('Bad email');
    }
    const _id = mongoId();
    user._id = _id.toString();
    this.mailService.sendVerifyUser(user);
    return this.userRepository.create({
      ...user,
      _id: _id.toString(),
    });
  }

  public async addFriend(userId: string, friendId: string): Promise<void> {
    this.websocketUtils.notifyUser('NEW_FRIEND_REQUEST', userId);
    await this.userRepository.addFriend(userId, friendId);
  }

  public async changeLanguage(userId: string, lang: string): Promise<void> {
    const user = await this.userRepository.get(userId);
    if (user) {
      user.lang = lang;
      await this.userRepository.update(userId, user);
    }
  }

  public async verifyMail(userId: string): Promise<void> {
    const user = await this.userRepository.get(userId);
    if (user) {
      user.verified = true;
      await this.userRepository.update(userId, user);
    }
  }

  public async acceptFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<void> {
    const user = await this.userRepository.get(userId);
    const friend = await this.userRepository.get(friendId);
    const hasFriendRequest = !!user?.friendRequest.find(
      (friendRequest) => friendRequest._id.toString() === friendId.toString(),
    );
    if (user && friend && hasFriendRequest) {
      user.friendRequest = user.friendRequest.filter(
        (friendRequest) =>
          friendRequest._id.toString() !== friend._id.toString(),
      );
      user.friends.push(friend);
      friend.friends.push(user);
      await this.userRepository.update(userId, user);
      await this.userRepository.update(friendId, friend);
    }
  }

  public async deleteFriendRequest(
    userId: string,
    friendId: string,
  ): Promise<void> {
    const user = await this.userRepository.get(userId);
    const friend = await this.userRepository.get(friendId);
    const hasFriendRequest = !!user?.friendRequest.find(
      (friendRequest) => friendRequest._id.toString() === friendId.toString(),
    );
    if (user && friend && hasFriendRequest) {
      user.friendRequest = user.friendRequest.filter(
        (friendRequest) =>
          friendRequest._id.toString() !== friend._id.toString(),
      );
      await this.userRepository.update(userId, user);
    }
  }

  public async changePassword(
    password: string,
    passwordRequestId: string,
  ): Promise<void> {
    const passwordRequest =
      await this.passwordRequestRepository.get(passwordRequestId);
    if (
      passwordRequest &&
      new Date(passwordRequest.expirationDate).getTime() > Date.now()
    ) {
      await this.userRepository.update(passwordRequest.user._id, {
        password,
      } as IUser);
    }
  }

  public async readNews(userId: string): Promise<void> {
    await this.userRepository.update(userId, { hasReadNews: true } as IUser);
  }

  public async login(username: string, password: string): Promise<IUser> {
    const user = await this.userRepository.getByUsername(username);
    if (!user || !user.verified) {
      throw new HttpException('Email not verified', HttpStatus.BAD_REQUEST);
    } else if (await this.hashService.checkPassword(user, password)) {
      return user;
    } else {
      throw new HttpException(
        'Password and username do not match',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async deleteGameForUsers(gameId: string): Promise<void> {
    await this.userRepository.updateMany({}, { $pull: { games: gameId } });
  }
}
