import { Injectable } from '@nestjs/common';

interface Room {
  name: string;
  members: Set<string>;
}

@Injectable()
export class RoomService {
  private rooms: Map<string, Room> = new Map();

  createRoom(roomName: string) {
    const room: Room = {
      name: roomName,
      members: new Set(),
    };
    console.log('Room created');
    console.log(room);
    this.rooms.set(roomName, room);
  }

  joinRoom(roomName: string, userId: string) {
    const room = this.rooms.get(roomName);
    if (room) {
      room.members.add(userId);
      console.log(room);
    }
    console.log('Room pipicaca');
  }

  leaveRoom(roomName: string, userId: string) {
    const room = this.rooms.get(roomName);
    if (room) {
      room.members.delete(userId);
      console.log(room);
      if (room.members.size === 0) {
        this.rooms.delete(roomName);
      }
    }
  }

  getRoomMembers(roomName: string): string[] {
    const room = this.rooms.get(roomName);
    //console.log([...room.members]);
    return room ? [...room.members] : [];
  }
}
