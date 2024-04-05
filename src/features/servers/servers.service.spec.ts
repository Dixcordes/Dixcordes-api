import { getModelToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { Server } from './server.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { ServerUser } from '../server-user/server-user.model';

const userId = '4';
const testServer = {
  id: 15,
  photo: '',
  name: 'testCreateServer',
  isPublic: false,
  isActive: true,
  admin: userId,
  totalMembers: new Set<number>([1]),
  members: new Set<string>(['1']),
};

describe('ServersService', () => {
  let service: ServersService;

  const mockSequelizeServers = {
    create: jest.fn(() => testServer),
    findAll: jest.fn(() => [testServer]),
    findOne: jest.fn(),
    $set: jest.fn().mockResolvedValue(2),
  };

  const mockSequelizeUsers = {
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  const mockSequelizeServerUser = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServersService,
        {
          provide: getModelToken(Server),
          useValue: mockSequelizeServers,
        },
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockSequelizeUsers,
        },
        {
          provide: getModelToken(ServerUser),
          useValue: mockSequelizeServerUser,
        },
      ],
    }).compile();

    service = module.get<ServersService>(ServersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('List servers', () => {
    it('should list all users and return an empty array', async () => {
      mockSequelizeServers.findAll.mockReturnValue([testServer]);
      expect(await service.findAll()).toEqual([testServer]);
    });

    it('should return a server when findOne by id', async () => {
      const serverId = 1;
      mockSequelizeServers.findOne.mockReturnValue(testServer);
      expect(await service.findOne(serverId)).toEqual(testServer);
    });
  });

  // describe('Create and update a server', () => {});
});
