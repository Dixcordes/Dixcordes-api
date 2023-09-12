export class ServerDto {
  id: number;
  uuid: string;
  name: string;
  photo: string;
  isPublic: boolean;
  isActive: boolean;
  admin: string;
  totalMembers: Set<number>;
  members: Set<string>;
}
