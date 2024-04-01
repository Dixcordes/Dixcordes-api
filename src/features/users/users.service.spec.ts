import { getModelToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { User } from './user.model';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockSequelizeUsers = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockSequelizeUsers,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('List users', () => {
    it('should list all users and return an empty array', async () => {
      mockSequelizeUsers.findAll.mockReturnValue([]);
      expect(await service.findAll()).toEqual([]);
    });
  });

  it('should return a user when findOne by id', async () => {
    const userId = 1;
    const user = {
      id: userId,
      firstName: 'Test',
      lastName: 'Test',
      email: 'testingemail@email.com',
      password: 'Pipicacazizi1234!',
      photo: '/files/users/default/default_photo.png',
      isAdmin: false,
    };
    mockSequelizeUsers.findOne.mockReturnValue(user);
    expect(await service.findOne(userId)).toEqual(user);
  });

  it('should return a user when findOne by email', async () => {
    const userEmail = 'testingemail@mail.com';
    const user = {
      id: 1,
      firstName: 'Test',
      lastName: 'Test',
      email: userEmail,
      password: 'Pipicacazizi1234!',
      photo: '/files/users/default/default_photo.png',
      isAdmin: false,
    };
    mockSequelizeUsers.findOne.mockReturnValue(user);
    expect(await service.findOneByEmail(userEmail)).toEqual(user);
  });

  it('should update a user', async () => {
    const userId = 1;
    const userDto = {
      firstName: 'Branko',
      lastName: 'Brankovic',
      id: 0,
      photo: '',
      email: '',
      password: '',
      isAdmin: false,
    };
    const user = {
      id: userId,
      firstName: 'Test',
      lastName: 'Test',
      email: 'testingmail@mail.com',
      photo: '/files/users/default/default_photo.png',
      isAdmin: false,
    };
    const userUpdated = {
      id: userId,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      email: user.email,
      photo: user.photo,
    };
    mockSequelizeUsers.findOne.mockReturnValue(user);
    expect(await mockSequelizeUsers.update.mockReturnValue(userUpdated));
  });
});
