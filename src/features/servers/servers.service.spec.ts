import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { TestingModule, Test } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { Server } from './server.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';
import { ServerUser } from '../server-user/server-user.model';

describe('ServersService', () => {
  let service: ServersService;

  const mockSequelizeServers = {
    create: jest.fn,
  };

  const mockSequelizeUsers = {
    findOne: jest.fn,
  };

  const mockSequelizeServerUser = {
    findOne: jest.fn,
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
});
