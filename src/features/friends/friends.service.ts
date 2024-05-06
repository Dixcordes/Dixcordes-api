import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Friends } from './models/friend.model';

@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(Friends)
    private friendModel: typeof Friends,
  ) {}

  async findAll(): Promise<Friends[]> {
    return this.friendModel.findAll();
  }
}
