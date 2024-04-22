import { getModelToken } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { Server } from './server.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { ServerUser } from '../server-user/server-user.model';

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

  const $get = {
    $get: jest.fn().mockReturnValue(2),
  };

  const mockSequelizeServers = {
    create: jest.fn(() => $set),
    findAll: jest.fn(() => [testServer]),
    findOne: jest.fn(),
    getAllMembers: jest.fn(() => $get),
    updateServer: jest.fn(),
  };

  const mockSequelizeUsers = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn,
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
    model = module.get<typeof Server>(getModelToken(Server));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create and return a server', async () => {
    expect(await service.createServer(testServer, userId));
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
    it('should update a server', async () => {
      const updateStub = jest.fn();
      const newUser = mockSequelizeUsers.create().mockReturnValue(4);

      const newServer = service.createServer(
        {
          id: 15,
          photo: '',
          name: 'testCreateServer',
          isPublic: false,
          isActive: true,
          admin: userId,
          totalMembers: new Set<number>([1]),
          members: new Set<string>(['1']),
        },
        newUser,
      );

      const findSpy = jest.spyOn(model, 'findOne').mockReturnValueOnce({
        update: updateStub,
      } as any);
      expect(
        service.updateServer(
          testServer.id,
          {
            id: 0,
            name: '',
            photo: '',
            isPublic: false,
            isActive: false,
            admin: '',
            totalMembers: undefined,
            members: undefined,
          },
          null,
          19,
        ),
      );
      expect(findSpy).toHaveBeenCalledWith({ where: { id: 'id' } });
    });
    // it('should remove a server', async () => {
    //   const destroyStub = jest.fn();
    //   const findSpy = jest.spyOn(model, 'findOne').mockReturnValue({
    //     destroy: destroyStub,
    //   } as any);
    //   const retVal = await service.;
    // })
  });

  describe('Server members', () => {
    // it('Should return all members of the server', async () => {
    //   const findSpy = jest.spyOn(model, 'findOne').mockReturnValueOnce({
    //     update: testServer,
    //   } as any);
    //   mockSequelizeServers.findOne.mockResolvedValue(testUser);
    //   await expect(service.getAllMembers(testServer.id));
    // });
  });
});
