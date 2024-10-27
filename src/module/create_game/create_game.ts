import { games } from "../../..";
import { randomIndex } from "../../utils/randomIndex";
import { WebSocket } from "ws";

 export function createGame(ws1: WebSocket, ws2: WebSocket) {
  const idGame = randomIndex();


  const player1Id = randomIndex();
  const player2Id = randomIndex();
  const createGame = {
    type: "create_game",
    data: {
      idGame,
      idPlayer: "",
    },
    id: 0,
  };

  games.set(idGame, {
    player1Id: [player1Id, ws1, false],
    player2Id: [player2Id, ws2, false],
  });




  ws1.send(JSON.stringify({ ...createGame, data: JSON.stringify({ ...createGame.data, idPlayer: player1Id }) }));
  ws2.send(JSON.stringify({ ...createGame, data: JSON.stringify({ ...createGame.data, idPlayer: player2Id }) }));
}
