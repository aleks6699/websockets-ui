import { httpServer } from "./src/http_server/index";
import { WebSocketServer } from "ws";
import { requestUserType, usersType } from "./src/types/type";
import { verifyAuth } from "./src/verify/verify";


export const users: usersType[] = [];


const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 3000 });



wsServer.on("connection", function connection(ws) {
  ws.on("message", (message) => {
    console.log(message);

    try {
      const messageString = typeof message === "string" ? message : message.toString();
      const data: requestUserType = JSON.parse(messageString);

      switch (data.type) {
        case "reg": {
          data.data = JSON.parse(data.data.toString());
          console.log(data);
          verifyAuth(data, ws);
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

