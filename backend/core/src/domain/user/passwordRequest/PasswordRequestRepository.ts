import CompleteRepository from '../../CompleteRepository';
import PasswordRequest, { IPasswordRequest } from './PasswordRequest';
import { PasswordRequestPopulater } from './PasswordRequestPopulater';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PasswordRequestRepository extends CompleteRepository<IPasswordRequest> {
  constructor(
    passwordRequestPopulater: PasswordRequestPopulater,
    @InjectModel(PasswordRequest.modelName)
    protected override readonly schema: Model<IPasswordRequest>,
  ) {
    super(schema, passwordRequestPopulater);
  }
}
