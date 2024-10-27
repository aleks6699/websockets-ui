import { users } from "../..";
import { WebSocket } from "ws";
export function getUserNameByWebSocket(ws: WebSocket): string | undefined {
  for (const [name, user] of users.entries()) {
    if (user.ws === ws) {
      return name;
    }
  }

  return undefined;
}
