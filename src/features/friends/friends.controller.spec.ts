import { Test } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { Friends } from './models/friend.model';

const testFriend = { id: 1, user_id: 4, target_id: 8 };

describe('FriendsController', () => {
  let controller: FriendsController;
  let service: FriendsService;

  const mockSequelizeFriends = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        {
          provide: FriendsService,
          useValue: mockSequelizeFriends,
        },
      ],
    }).compile();
    controller = modRef.get<FriendsController>(FriendsController);
    service = modRef.get<FriendsService>(FriendsService);
  });

  it('controller should be define', async () => {
    expect(controller).toBeDefined();
  });

  it('service should be define', async () => {
    expect(service).toBeDefined();
  });

  it('should get all the friends', async () => {
    jest
      .spyOn(service, 'findAll')
      .mockResolvedValue([testFriend as unknown as Friends]);

    expect(await controller.findAll()).toEqual([testFriend]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
