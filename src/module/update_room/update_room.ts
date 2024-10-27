import { RoomUpdate, usersType } from "../../types/type";
 
 export function updateRoom(room: RoomUpdate, users:Map<any, usersType>) {
  for (const user of users.values()) {
    user.ws.send(JSON.stringify({ ...room, data: JSON.stringify(room.data) }));
  }
}