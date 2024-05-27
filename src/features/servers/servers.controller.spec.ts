import { Test } from '@nestjs/testing';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { getModelToken } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Server } from './server.model';

const testServer = {
  id: 15,
  photo: '',
  name: 'testCreateServer',
  isPublic: false,
  isActive: true,
  admin: 1,
  totalMembers: new Set<number>([1]),
  members: new Set<string>(['1']),
};

const testUser = {
  id: 1,
  firstName: 'testUser',
  lastName: 'testUserLastName',
  photo: '',
  email: 'testUser@mail.com',
  password: 'testUserPasswordYesItscleariknow',
  isAdmin: false,
};

const mockReq = { user: { sub: 1 } };

describe('ServersController', () => {
  let controller: ServersController;
  let service: ServersService;

  const $set = {
    $set: jest.fn().mockReturnValue(2),
  };

  const mockSequelizeServers = {
    createServer: jest.fn(() => $set),
    findAll: jest.fn(() => [testServer]),
    findOne: jest.fn(),
    getAllMembers: jest.fn(() => [testUser]),
    updateServer: jest.fn(),
  };

  const mockSequelizeUsers = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn,
  };

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [ServersController],
      providers: [
        {
          provide: ServersService,
          useValue: mockSequelizeServers,
        },
        {
          provide: getModelToken(User),
          useValue: mockSequelizeUsers,
        },
      ],
    }).compile();
    controller = modRef.get<ServersController>(ServersController);
    service = modRef.get<ServersService>(ServersService);
  });

  it('controller should be define', async () => {
    expect(controller).toBeDefined();
  });

  it('service should be define', async () => {
    expect(service).toBeDefined();
  });

  describe('List servers', () => {
    it('should get all servers', async () => {
      expect(await service.findAll()).toEqual([testServer]);
    });

    it('should get one server', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(
          Promise.resolve(testServer as unknown as Promise<Server>),
        );
      await controller.findOne(15);
      expect(service.findOne).toHaveBeenCalled();
      expect(controller.findOne(15)).toEqual(Promise.resolve(testServer));
    });
  });

  describe('should create and update a server', () => {
    it('should create a server', async () => {
      jest
        .spyOn(service, 'createServer')
        .mockResolvedValue(
          Promise.resolve(testServer as unknown as Promise<Server>),
        );
      expect(await controller.createServer(testServer, mockReq)).toEqual(
        testServer,
      );
      expect(service.createServer).toHaveBeenCalled();
    });
  });
});
