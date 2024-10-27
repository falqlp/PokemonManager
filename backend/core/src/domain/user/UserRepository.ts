import CompleteRepository from 'shared/common/domain/CompleteRepository';
import User, { IUser } from './User';
import HashService from '../../application/user/hash/HashService';
import UserPopulater from './UserPopulater';
import { Injectable } from '@nestjs/common';
import { ListBody } from 'shared/common/domain/ReadOnlyRepository';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import WebsocketUtils from '../../websocket/WebsocketUtils';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
class UserRepository extends CompleteRepository<IUser> {
  constructor(
    private hashService: HashService,
    userPopulater: UserPopulater,
    private websocketUtils: WebsocketUtils,
    @InjectModel(User.modelName)
    protected override readonly schema: Model<IUser>,
  ) {
    super(schema, userPopulater);
  }

  public async get(
    _id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: {
      gameId?: string;
      map?: (entity: IUser) => IUser | Promise<IUser>;
    },
  ): Promise<IUser> {
    const user = await super.get(_id);
    user.password = undefined;
    return user;
  }

  public async list(
    body: ListBody,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: {
      gameId?: string;
      lang?: string;
      map?: (entity: IUser) => Promise<IUser> | IUser;
    },
  ): Promise<IUser[]> {
    return super.list(body);
  }

  public async addFriend(userId: string, friendId: string): Promise<void> {
    await this.schema.findByIdAndUpdate(
      userId,
      { $push: { friendRequest: friendId } },
      { new: true },
    );
    this.websocketUtils.updateUsers([userId, friendId]);
  }

  public async getByUsername(username: string): Promise<IUser> {
    return this.schema.findOne({ username });
  }

  public async update(_id: string, dto: IUser): Promise<IUser> {
    if (dto.password) {
      dto.password = await this.hashService.hashPassword(dto.password);
    }
    this.websocketUtils.updateUsers([_id]);
    return super.update(_id, dto);
  }

  public async updateManyUser(
    filter: FilterQuery<IUser>,
    update: UpdateQuery<IUser>,
  ): Promise<void> {
    await this.schema.updateMany(filter, update);
  }
}

export default UserRepository;
