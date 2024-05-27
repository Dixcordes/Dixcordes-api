import { Test } from '@nestjs/testing';
import { FriendsRequestController } from './friends-request.controller';
import { FriendsRequestService } from './friends-request.service';
import { FriendsRequest } from './model/friend-request.model';

const testFriendRequest = { from: 1, to: 2, answer: null };
const testSecondFriendRequest = { from: 1, to: 3, answer: null };
const testThirdFriendRequest = { from: 2, to: 3, answer: null };

const mockReq = { user: { sub: 2 } };

describe('FriendsRequestController', () => {
  let controller: FriendsRequestController;
  let service: FriendsRequestService;

  const mockSequelizeFriendsRequest = {
    findAll: jest.fn(() => [
      testFriendRequest,
      testSecondFriendRequest,
      testThirdFriendRequest,
    ]),
    findAllUserRequest: jest.fn(),
    findUser: jest.fn(() => 1),
    findOne: jest.fn(),
    create: jest.fn(() => testFriendRequest),
    remove: jest.fn(),
    update: jest.fn(() => testFriendRequest),
    findFriendRequest: jest.fn(),
  };

  beforeEach(async () => {
    const modRef = await Test.createTestingModule({
      controllers: [FriendsRequestController],
      providers: [
        {
          provide: FriendsRequestService,
          useValue: mockSequelizeFriendsRequest,
        },
      ],
    }).compile();
    controller = modRef.get<FriendsRequestController>(FriendsRequestController);
    service = modRef.get<FriendsRequestService>(FriendsRequestService);
  });

  it('controller should be define', async () => {
    expect(controller).toBeDefined();
  });

  it('service should be define', async () => {
    expect(service).toBeDefined();
  });

  describe('Get requests', () => {
    it('should get all the friends requests', async () => {
      // Mock the findAllUserRequest method and return the expected result
      jest
        .spyOn(service, 'findAllUserRequest')
        .mockResolvedValue([{ ...testThirdFriendRequest } as FriendsRequest]);

      expect(await controller.findAllUserRequest(mockReq)).toEqual([
        { ...testThirdFriendRequest },
      ]);
      expect(service.findAllUserRequest).toHaveBeenCalled();
    });

    it('should return one request', async () => {
      jest
        .spyOn(service, 'findFriendRequest')
        .mockResolvedValue(testFriendRequest as FriendsRequest);

      expect(await controller.findFriendRequest(1, mockReq)).toEqual(
        testFriendRequest,
      );
      expect(service.findFriendRequest).toHaveBeenCalled();
    });
  });
});
