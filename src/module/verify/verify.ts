import { requestUserType, responseUserType } from "../../types/type";
import { users } from "../../..";
import { WebSocket } from "ws";

let index = 1;

export function verifyAuth(data: requestUserType, ws: WebSocket) {
  const { name, password } = data.data;

  const response: responseUserType = {
    type: "reg",
    data: {
      name,
      index,
      error: false,
      errorText: "",
    },
    id: 0,
  };
  console.log(users)

  const existingUser = users.get(name);

  if (!existingUser) {
    users.set(name, { name, password, ws });
    index++; 

    ws.send(JSON.stringify({ ...response, data: JSON.stringify(response.data) }));
    console.log(`User registered: ${name}`);
    return;
  }

  if (existingUser.password === password) {
    ws.send(
      JSON.stringify({ ...response, data: JSON.stringify(existingUser) })
    );
    console.log(`User ${name} authenticated successfully.`);
  } else {   
    const errorResponse: responseUserType = {
      type: "reg",
      data: {
        name,
        index: 0,
        error: true,
        errorText: "Incorrect password",
      },
      id: 0,
    };
    ws.send(JSON.stringify({ ...errorResponse, data: JSON.stringify(errorResponse.data) }));
    console.error(`Authentication failed for ${name}: incorrect password.`);
  }
}