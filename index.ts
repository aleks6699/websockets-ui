import { httpServer } from "./src/http_server/index";
import { WebSocketServer, WebSocket } from "ws";
import { requestUserType, usersType, RoomUpdate } from "./src/types/type";
import { verifyAuth } from "./src/verify/verify";
import { randomIndex } from "./src/utils/randomIndex";

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

      switch (data.type) {
        case "reg": {
          data.data = JSON.parse(data.data.toString());
          verifyAuth(data, ws);
          updateRoom(room, ws);
          updateWinners(winners, ws);
          break;
        }

        case "create_room": {
          room.data.push({ roomId: randomIndex(), roomUsers: [{ name: name, index: 1 }] });
          updateRoom(room, ws);
          break;
        }

        case "add_user_to_room": {
          const { indexRoom } = JSON.parse(data.data.toString());
          console.log(name);
          console.log(indexRoom);

          room.data = room.data.map((room) => {
            if (room.roomId === indexRoom) {
              console.log("Проверяем комнату:", room);

              const userExists = room.roomUsers.some((user) => user.name === name);
              console.log("Пользователь уже существует?", userExists);

              if (!userExists) {
                console.log("Добавляем пользователя:", name);

                const updatedUsers = [...room.roomUsers, { name: name, index: room.roomUsers.length + 1 }];

                return { ...room, roomUsers: updatedUsers };
              }
            }
            return room;
          });



          updateRoom(room, ws);

          if (room.data.some(r => r.roomId === indexRoom && r.roomUsers.length === 2)) {
            room.data = room.data.map((room) => {
              if (room.roomId === indexRoom) {
                const [user1, user2] = room.roomUsers;
                createGame(users.get(user1.name)?.ws as WebSocket)
                createGame(users.get(user2.name)?.ws as WebSocket)


              }
              return room;
            })

          }
          room.data = room.data.filter((room) => room.roomUsers.length < 2);

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

function updateWinners(winners: any, ws: WebSocket) {
  ws.send(JSON.stringify({ ...winners, data: JSON.stringify(winners.data) }));
}

function updateRoom(room: RoomUpdate, ws: WebSocket) {
  ws.send(JSON.stringify({ ...room, data: JSON.stringify(room.data) }));
}

export function handleDisconnect(ws: WebSocket) {
  for (const [name, user] of users.entries()) {
    if (user.ws === ws) {
      users.delete(name);
      console.log(`User ${name} disconnected and removed.`);
      break;
    }
  }
}

export function getUserNameByWebSocket(ws: WebSocket): string | undefined {
  for (const [name, user] of users.entries()) {
    if (user.ws === ws) {
      return name;
    }
  }

  return undefined;
}

function createGame(ws: WebSocket) {
  const createGame = {
    type: "create_game",
    data: {
      idGame: randomIndex(),
      idPlayer: randomIndex(),
    },
    id: 0,
  };

  ws.send(JSON.stringify({ ...createGame, data: JSON.stringify(createGame.data) }));
}
