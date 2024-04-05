import { getModelToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { Server } from './server.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { ServerUser } from '../server-user/server-user.model';

describe('ServersService', () => {
  let service: ServersService;

  const mockSequelizeServers = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSequelizeUsers = {
    findOne: jest.fn(),
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
      mockSequelizeServers.findAll.mockReturnValue([]);
      expect(await service.findAll()).toEqual([]);
    });

    it('should return a server when findOne by id', async () => {
      const serverId = 1;
      const server = {
        id: serverId,
        name: 'serverTestName',
        photo: '/files/servers/default/default_photo.png',
        isPublic: true,
        isActive: true,
        admin: 1,
        totalMembers: 1,
        members: 1,
      };
      mockSequelizeServers.findOne.mockReturnValue(server);
      expect(await service.findOne(serverId)).toEqual(server);
    });
  });
});
