import { users } from "../..";
import { WebSocket } from "ws";
export function handleDisconnect(ws: WebSocket) {
  for (const [name, user] of users.entries()) {
    if (user.ws === ws) {
      users.delete(name);
      console.log(`User ${name} disconnected and removed.`);
      break;
    }
  }
}
