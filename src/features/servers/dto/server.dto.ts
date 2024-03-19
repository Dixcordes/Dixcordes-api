import { IsNotEmpty, IsString } from 'class-validator';

export class ServerDto {
  id: number;
  uuid: string;

  @IsString()
  @IsNotEmpty()
  name: string;
  photo: string;
  isPublic: boolean;
  isActive: boolean;
  admin: string;
  totalMembers: Set<number>;
  members: Set<string>;
}
