import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.model';
import { get } from 'http';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const mockSequelizeUsers = {
    findOne: jest.fn(),
  };

  const mockAuthService = {
    SignUp: jest.fn(),
    SignIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getModelToken(User),
          useValue: mockSequelizeUsers,
        },
        {
          provide: getModelToken(AuthService),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
