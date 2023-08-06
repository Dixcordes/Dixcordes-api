export class ServerDto {
  id: string;
  name: string;
  photo: string;
  isPublic: boolean;
  isActive: boolean;
  admin: string;
  totalMembers: Set<number>;
  members: Set<string>;
}
