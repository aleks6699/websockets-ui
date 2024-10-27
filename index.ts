import { httpServer } from "./src/http_server/index";
import { WebSocketServer, WebSocket } from "ws";
import { usersType, RoomUpdate } from "./src/types/type";
import { verifyAuth } from "./src/module/verify/verify";
import { randomIndex } from "./src/utils/randomIndex";
import { startGame } from "./src/module/start_game/start_game";
import { updateRoom } from "./src/module/update_room/update_room";
import { updateWinners } from "./src/module/update_winners/update_winners";
import { createGame } from "./src/module/create_game/create_game";
import { getUserNameByWebSocket } from "./src/utils/getUserNameByWebSocket";
import { handleDisconnect } from "./src/utils/handleDisconnect";
import { turn } from "./src/module/turn/turn";

const winners = {
  type: "update_winners",
  data: [],
  id: 0,
};

let room: RoomUpdate = {
  type: "update_room",
  data: [],
  id: 0,
};

export const users: Map<any, usersType> = new Map();
export const games: Map<any, any> = new Map();

const HTTP_PORT = 8181;
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on("connection", function connection(ws) {
  ws.on("message", (message) => {
    try {
      const messageString = typeof message === "string" ? message : message.toString();
      const data: any = JSON.parse(messageString);
      const name = getUserNameByWebSocket(ws) as string;
      console.log(data);

      switch (data.type) {
        case "reg": {
          data.data = JSON.parse(data.data.toString());
          verifyAuth(data, ws);
          updateRoom(room, users);
          updateWinners(winners, users);
          break;
        }

        case "create_room": {
          room.data.push({ roomId: randomIndex(), roomUsers: [{ name: name, index: 1 }] });
          updateRoom(room, users);
          break;
        }

        case "add_user_to_room": {
          const { indexRoom } = JSON.parse(data.data.toString());
          console.log(name);
          console.log(indexRoom);

          room.data = room.data.map((room) => {
            if (room.roomId === indexRoom) {
              const userExists = room.roomUsers.some((user) => user.name === name);

              if (!userExists) {

                const updatedUsers = [...room.roomUsers, { name: name, index: room.roomUsers.length + 1 }];

                return { ...room, roomUsers: updatedUsers };
              }
            }
            return room;
          });

          updateRoom(room, users);

          if (room.data.some(r => r.roomId === indexRoom && r.roomUsers.length === 2)) {
            room.data = room.data.map((room) => {
              if (room.roomId === indexRoom) {
                const [user1, user2] = room.roomUsers;
                createGame(users.get(user1.name)?.ws as WebSocket, users.get(user2.name)?.ws as WebSocket);
              }
              return room;
            })
          }
          room.data = room.data.filter((room) => room.roomUsers.length < 2);

          break;
        }
        case "add_ships": {
          startGame(data);
          break;
        }
        case "attack": {
          attack(data, games);
          turn(data, games);

          break;
        }

        default: {
          console.log(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  });

  ws.on("open", () => {
    console.log("connected");
  });

  ws.on("close", () => {
    console.log("disconnected");
    handleDisconnect(ws);
  });

  ws.on("error", () => {
    handleDisconnect(ws);
    console.log("error");
  });
});

function attack(data: any, games: Map<any, any>) {
  const { x, y, gameId, indexPlayer } = JSON.parse(data.data.toString());
  console.log(x, y, gameId, indexPlayer)

  const atack = {
    type: "attack",
    data: {
      position: { x, y },
      currentPlayer: indexPlayer,
      status: "miss"
    },
    id: 0,
  }

  const game = games.get(gameId);
  game.player1Id[1].send(JSON.stringify({ ...atack, data: JSON.stringify({ ...atack.data, position: JSON.stringify({ ...atack.data.position }) }) }));
  game.player2Id[1].send(JSON.stringify({ ...atack, data: JSON.stringify({ ...atack.data, position: JSON.stringify({ ...atack.data.position }) }) }));
}



