import { httpServer } from "./src/http_server/index";
import { WebSocketServer, WebSocket } from "ws";
import { requestUserType, usersType, RoomUpdate } from "./src/types/type";
import { verifyAuth } from "./src/verify/verify";
import { randomIndex } from "./src/utils/randomIndex";



export const users: usersType[] = [];
const winners = {
  type: "update_winners",

  data:
    [],

  id: 0

}
const room: RoomUpdate = {
  type: "update_room",

  data:
    [],

  id: 0

}


const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 3000 });



wsServer.on("connection", function connection(ws) {
  ws.on("message", (message) => {

    try {
      const messageString = typeof message === "string" ? message : message.toString();
      const data: requestUserType = JSON.parse(messageString);
      console.log(randomIndex());
      console.log(data);


      switch (data.type) {
        case "reg": {
          data.data = JSON.parse(data.data.toString());
          verifyAuth(data, ws);
          updateRoom(room, ws);
          updateWinners(winners, ws);
          break;
        }

        case "create_room": {
          const { name, index } = users[users.length - 1];
          room.data.push({ roomId: randomIndex(), roomUsers: [{ name, index }] });
          updateRoom(room, ws);
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
  });

  ws.on("error", () => {
    console.log("error");
  });
});

function updateWinners(winners: any, ws: WebSocket) {

  ws.send(JSON.stringify({ ...winners, data: JSON.stringify(winners.data) }));
}

function updateRoom(room:RoomUpdate, ws: WebSocket) {


  ws.send(JSON.stringify({ ...room, data: JSON.stringify(room.data) }));
}