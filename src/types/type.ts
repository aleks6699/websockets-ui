export type usersType = {
  name: string;
  password: string;
  index: number;
}
export type responseUserType = {
  type: string;
  data: {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  };
  id: number;
}

export type requestUserType = {
  password: string;
  name: string;
  type: string;
  data: {
    index: never;
    name: string;
    password: string;
  };
  id: 0;
}


interface RoomUser {
  name: string;
  index: number;
}

// Тип для комнаты
interface Room {
  roomId: string;
  roomUsers: RoomUser[];
}

// Тип основного объекта с типом сообщения
export interface RoomUpdate {
  type: "update_room";
  data: Room[];
  id: 0;
}