import { Test } from '@nestjs/testing';
import { FriendsRequestService } from './friends-request.service';
import { FriendsRequest } from './model/friend-request.model';
import { getModelToken } from '@nestjs/sequelize';
import { Friends } from '../friends/models/friend.model';
import { User } from '../users/user.model';
import { UsersService } from '../users/users.service';
import { FriendsService } from '../friends/friends.service';

const testFriendRequest = { from: 1, to: 2, answer: null };
const testSecondFriendRequest = { from: 1, to: 3, answer: null };
const testThirdFriendRequest = { from: 2, to: 3, answer: null };

const user = { id: 2, email: 'testmail@mail.com' };

const newFriendship = { user_id: 1, target_id: 2 };

describe('FriendsRequestService', () => {
  let service: FriendsRequestService;
  let model: FriendsRequest;

  const mockSequelizeFriendsRequest = {
    findAll: jest.fn(() => [
      testFriendRequest,
      testSecondFriendRequest,
      testThirdFriendRequest,
    ]),
    findUser: jest.fn(() => 1),
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

  it('should get all the friends requests', async () => {
    expect(await service.findAll()).toEqual([
      testFriendRequest,
      testSecondFriendRequest,
      testThirdFriendRequest,
    ]);
  });

  it('should return all user request', async () => {
    jest
      .spyOn(service, 'findAllUserRequest')
      .mockResolvedValue(
        Promise.resolve([testThirdFriendRequest] as unknown as Promise<
          FriendsRequest[]
        >),
      );
    expect(await service.findAllUserRequest(2)).toEqual([
      testThirdFriendRequest,
    ]);
  });

  it('should return one request by the user who send the request and the one receiving it', async () => {
    jest
      .spyOn(service, 'findFriendRequest')
      .mockResolvedValue(
        Promise.resolve(
          testFriendRequest as unknown as Promise<FriendsRequest>,
        ),
      );
    expect(await service.findFriendRequest(1, 2)).toEqual(testFriendRequest);
  });

  it('should create a friend request object', async () => {
    jest
      .spyOn(service, 'sendAddFriendRequest')
      .mockResolvedValue(
        Promise.resolve(
          testFriendRequest as unknown as Promise<FriendsRequest>,
        ),
      );
    expect(await service.sendAddFriendRequest(1, user.email)).toEqual(
      testFriendRequest,
    );
  });

  it('should accept or deny an friend request', async () => {
    jest
      .spyOn(service, 'answerFriendRequest')
      .mockResolvedValue(
        Promise.resolve(newFriendship as unknown as Promise<Friends>),
      );
    expect(await service.answerFriendRequest({ from: 1, to: 2, answer: true }));
  });
});
