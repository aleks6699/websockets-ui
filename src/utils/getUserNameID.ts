import { WebSocket } from "ws";
export function getUserNameID(ws: WebSocket, games: Map<any, any>): string | null {
  for (const [gameId, game] of games) {
    const [player1Id, ws1] = game.player1Id;
    const [player2Id, ws2] = game.player2Id;

    if (ws === ws1) return player1Id; // Нашли игрока 1
    if (ws === ws2) return player2Id; // Нашли игрока 2
  }
  
  console.error("Игрок с таким WebSocket не найден.");
  return null; 
}

