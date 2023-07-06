export class ServerDto {
  id: number;
  name: string;
  photo: string;
  isPublic: boolean;
  isActive: boolean;
  totalMembers: Set<number>;
  members: Set<string>;
}
