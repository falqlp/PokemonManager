import Populater from '../../Populater';
import { Injectable } from '@nestjs/common';
import { Model, PopulateOptions } from 'mongoose';
import User from '../User';
import PasswordRequest, { IPasswordRequest } from './PasswordRequest';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PasswordRequestPopulater extends Populater<IPasswordRequest> {
  constructor(
    @InjectModel(PasswordRequest.modelName)
    public readonly schema: Model<IPasswordRequest>,
  ) {
    super();
  }
  populate(): PopulateOptions | PopulateOptions[] {
    return {
      path: 'user',
      model: User,
    };
  }
}
