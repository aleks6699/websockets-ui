import { WebSocket } from "ws";
export type usersType = {
  name: string;
  password: string;
  ws: WebSocket;
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


export interface RoomUser {
  name: string;
  index: number;
}

 export interface Room {
  roomId: string;
  roomUsers: RoomUser[];
}

export interface RoomUpdate {
  type: "update_room";
  data: Room[];
  id: 0;
}
 export type GamesType = Map<string, { player1Id: [string, WebSocket, boolean]; player2Id: [string, WebSocket, boolean] }>;

 export type Turn = {
  type: "turn";
  data: {
    currentPlayer: string;
  };
  id: 0;
}

