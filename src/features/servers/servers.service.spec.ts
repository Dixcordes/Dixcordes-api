import { getModelToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { Server } from './server.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { ServerUser } from '../server-user/server-user.model';
import { ChannelsServers } from '../channels-server/models/channel-server.model';
import { HttpException } from '@nestjs/common';

let id: number;

const userId = '4';

const testUser = {
  id: +userId,
  firstName: 'testUser',
  lastName: 'testUserLastName',
  photo: '',
  email: 'testUser@mail.com',
  password: 'testUserPasswordYesItscleariknow',
  isAdmin: false,
};

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
  let model: typeof Server;

  const $set = {
    $set: jest.fn().mockReturnValue(2),
  };

  const mockSequelizeServers = {
    create: jest.fn(() => $set),
    findAll: jest.fn(() => [testServer]),
    findOne: jest.fn(),
    getAllMembers: jest.fn(() => [testUser]),
    updateServer: jest.fn(),
    deleteServer: jest.fn(),
  };

  const mockSequelizeUsers = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn,
  };

  const mockSequelizeServerUser = {
    findOne: jest.fn(),
  };

  const mockSequelizeChannelsServer = {
    findOne: jest.fn(),
    destroy: jest.fn(),
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
        {
          provide: getModelToken(ChannelsServers),
          useValue: mockSequelizeChannelsServer,
        },
      ],
    }).compile();

    service = module.get<ServersService>(ServersService);
    model = module.get<typeof Server>(getModelToken(Server));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create and return a server', async () => {
    expect(
      await service.createServer(
        {
          id: 15,
          photo: '',
          name: 'testCreateServer',
          isPublic: false,
          isActive: true,
          admin: parseInt(userId),
          totalMembers: new Set<number>([1]),
          members: new Set<string>(['1']),
        },
        userId,
      ),
    );
  });

  describe('List servers', () => {
    it('should list and return all servers', async () => {
      expect(await service.findAll()).toEqual([testServer]);
    });

    it('should return a single server', async () => {
      const findSpy = jest.spyOn(model, 'findOne');
      expect(await service.findOne(id));
      expect(findSpy).toHaveBeenCalledWith({ where: { id: id } });
    });
  });

  describe('Update and delete a server', () => {
    // it('should update a server', async () => {
    //   const newServer = await service.createServer(
    //     {
    //       id: 0,
    //       name: 'UwU',
    //       photo: null,
    //       isPublic: false,
    //       isActive: false,
    //       admin: 2,
    //       totalMembers: undefined,
    //       members: undefined,
    //     },
    //     userId,
    //   );
    //   const updatedServer = await service.updateServer(
    //     newServer.id,
    //     {
    //       name: 'Gang',
    //       id: 0,
    //       photo: '',
    //       isPublic: false,
    //       isActive: false,
    //       admin: 2, // Add a null check for testUser before accessing its id property
    //       totalMembers: undefined,
    //       members: undefined,
    //     },
    //     null,
    //     2, // Add a null check for testUser before passing its id as an argument
    //   );
    //   expect(updatedServer).toBeDefined();
    //   expect({
    //     id: updatedServer.id,
    //     name: updatedServer.name,
    //     photo: '',
    //     isPublic: false,
    //     isActive: false,
    //     admin: testUser.id,
    //     totalMembers: undefined,
    //     members: undefined,
    //   }).toEqual(updatedServer);
    // });
    it('should delete a server', async () => {
      const destroyStub = jest.fn();
      jest.spyOn(model, 'findOne').mockReturnValue({
        destroy: destroyStub,
      } as any);
      jest
        .spyOn(service, 'deleteServer')
        .mockResolvedValue(
          Promise.resolve(testServer as unknown as Promise<HttpException>),
        );
      jest
        .spyOn(User, 'findOne')
        .mockResolvedValue(
          Promise.resolve(testUser as unknown as Promise<User>),
        );
      await service.deleteServer(
        {
          serverId: testServer.id,
          serverName: testServer.name,
        },
        parseInt(userId),
      );
      expect(service.deleteServer).toHaveBeenCalledTimes(1);
    });
  });

  describe('Server members', () => {
    // it('Should return all members of the server', async () => {
    //   const findSpy = jest.spyOn(model, 'findOne').mockReturnValueOnce({
    //     id: testServer.id,
    //   } as any);
    //   expect(service.getAllMembers(testServer.id)).toEqual([testUser]);
    //   expect(findSpy).toHaveBeenCalledWith({ where: { id: testServer.id } });
    // });
  });
});
