import HashService from './HashService';
import { container } from 'tsyringe';
import { IUser } from '../../../domain/user/User';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('HashService', () => {
  let hashService: HashService;

  beforeEach(() => {
    hashService = container.resolve(HashService);
  });

  describe('hashPassword', () => {
    it('should hash the password correctly', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await hashService.hashPassword(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('checkPassword', () => {
    it('should return true if the password matches', async () => {
      const user: IUser = { password: 'hashedPassword123' } as IUser;
      const inputPassword = 'password123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await hashService.checkPassword(user, inputPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(inputPassword, user.password);
      expect(result).toBe(true);
    });

    it('should return false if the password does not match', async () => {
      const user: IUser = { password: 'hashedPassword123' } as IUser;
      const inputPassword = 'wrongPassword123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await hashService.checkPassword(user, inputPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(inputPassword, user.password);
      expect(result).toBe(false);
    });
  });
});
