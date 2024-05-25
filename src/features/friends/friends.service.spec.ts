import { Test } from '@nestjs/testing';
import { FriendsService } from './friends.service';
import { Friends } from './models/friend.model';
import { getModelToken } from '@nestjs/sequelize';

const testFriend = { user_id: 1, target_id: 2 };

describe('FriendsService', () => {
  let service: FriendsService;
  let model: typeof Friends;

  const mockSequelizeFriends = {
    findAll: jest.fn(() => [testFriend]),
    findOne: jest.fn(),
    create: jest.fn(() => testFriend),
    remove: jest.fn(),
    update: jest.fn(() => testFriend),
  };

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      providers: [
        FriendsService,
        {
          provide: getModelToken(Friends),
          useValue: mockSequelizeFriends,
        },
      ],
    }).compile();
    service = modRef.get<FriendsService>(FriendsService);
    model = modRef.get<typeof model>(getModelToken(Friends));
  });

  it('should get all the friends', async () => {
    expect(await service.findAll()).toEqual([testFriend]);
  });
});
