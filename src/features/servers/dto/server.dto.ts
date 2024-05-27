import { IsNotEmpty, IsString } from 'class-validator';

export class ServerDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
  photo: string;
  isPublic: boolean;
  isActive: boolean;
  admin: number;
  totalMembers: Set<number>;
  members: Set<string>;
}
