export class ServerDto {
  id: number;
  name: string;
  photo: string;
  isPublic: boolean;
  isActive: boolean;
  admin: string;
  totalMembers: Set<number>;
  members: Set<string>;
}
