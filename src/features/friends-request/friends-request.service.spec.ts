import { Test } from '@nestjs/testing';
import { FriendsRequestService } from './friends-request.service';
import { FriendsRequest } from './model/friend-request.model';
import { getModelToken } from '@nestjs/sequelize';
import { Friends } from '../friends/models/friend.model';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { FriendsService } from '../friends/friends.service';

const testFriendRequest = { from: 1, to: 2, answer: true };

describe('FriendsRequestService', () => {
  let service: FriendsRequestService;
  let model: FriendsRequest;

  const mockSequelizeFriendsRequest = {
    findAll: jest.fn(() => [testFriendRequest]),
    findOne: jest.fn(),
    create: jest.fn(() => testFriendRequest),
    remove: jest.fn(),
    update: jest.fn(() => testFriendRequest),
  };

  const mockSequelizeFriends = {
    findOne: jest.fn(),
  };

  const mockSequelizeUsers = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        FriendsRequestService,
        {
          provide: getModelToken(FriendsRequest),
          useValue: mockSequelizeFriendsRequest,
        },
        FriendsService,
        {
          provide: getModelToken(Friends),
          useValue: mockSequelizeFriends,
        },
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockSequelizeUsers,
        },
      ],
    }).compile();
    service = modRef.get<FriendsRequestService>(FriendsRequestService);
    model = modRef.get<typeof model>(getModelToken(FriendsRequest));
  });

  it('should get all the friends', async () => {
    expect(await service.findAll()).toEqual([testFriendRequest]);
  });
});
