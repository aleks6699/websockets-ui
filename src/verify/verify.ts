import { requestUserType, responseUserType } from "../types/type";
import { users } from "../..";
import { WebSocket } from "ws";

let index = 1;

export function verifyAuth(data: requestUserType, ws: WebSocket) {
  const response: responseUserType = {
    type: "reg",
    data: {
      name: data.name,
      index: index++,
      error: false,
      errorText: " ",
    },
    id: 0,
  };
  const user = users.find((user) => user.name === data.data.name);
  if (user && user.password === data.data.password) {
    return ws.send(
      JSON.stringify({ ...response, data: JSON.stringify(response.data) })
    )
  } else if (!user) {
    users.push({ name: data.data.name, password: data.data.password, index: index++ });
    return ws.send(
      JSON.stringify({ ...response, data: JSON.stringify(response.data) })
    );
  };

  return ws.send(
    JSON.stringify({ ...response, data: JSON.stringify({ ...response.data, error: true, errorText: "Wrong name or password" }) })
  );
}
