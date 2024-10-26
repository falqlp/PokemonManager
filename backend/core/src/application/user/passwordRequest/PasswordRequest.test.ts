import { Test, TestingModule } from '@nestjs/testing';
import { PasswordRequestService } from './PasswordRequestService';
import { PasswordRequestRepository } from '../../../domain/user/passwordRequest/PasswordRequestRepository';
import UserRepository from '../../../domain/user/UserRepository';
import { MailService } from '../../mail/MailService';
import { IUser } from '../../../domain/user/User';

describe('PasswordRequestService', () => {
  let passwordRequestService: PasswordRequestService;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordRequestRepository: jest.Mocked<PasswordRequestRepository>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordRequestService,
        {
          provide: UserRepository,
          useValue: {
            list: jest.fn(),
          },
        },
        {
          provide: PasswordRequestRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendModifyPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    passwordRequestService = module.get<PasswordRequestService>(
      PasswordRequestService,
    );
    userRepository = module.get(UserRepository);
    passwordRequestRepository = module.get(PasswordRequestRepository);
    mailService = module.get(MailService);

    jest.clearAllMocks();
  });

  describe('createPasswordRequest', () => {
    it('should create a password request and send an email if user exists', async () => {
      const username = 'testuser';
      const email = 'test@example.com';
      const lang = 'en';
      const user: IUser = { _id: 'userId', username, email } as IUser;
      const passwordRequest = {
        _id: 'requestId',
        user,
        expirationDate: new Date(),
      };
      userRepository.list.mockResolvedValue([user]);
      passwordRequestRepository.create.mockResolvedValue(passwordRequest);
      mailService.sendModifyPassword.mockReturnValue();

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

    it('should not create a password request if user does not exist', async () => {
      const username = 'testuser';
      const email = 'test@example.com';
      const lang = 'en';
      userRepository.list.mockResolvedValue([]);

      await passwordRequestService.createPasswordRequest(username, email, lang);

      expect(userRepository.list).toHaveBeenCalledWith({
        custom: { username, email },
      });
      expect(passwordRequestRepository.create).not.toHaveBeenCalled();
      expect(mailService.sendModifyPassword).not.toHaveBeenCalled();
    });
  });
});
