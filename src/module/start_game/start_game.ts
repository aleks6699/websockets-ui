import { WebSocket } from "ws";
import { games } from "../../..";
export function startGame(data: any) {
  const parsedData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;

  const { gameId, ships, indexPlayer } = parsedData;

  const game = games.get(gameId);

  if (!game) {
    console.error(`Игра с ID ${gameId} не найдена.`);
    return;
  }

  const currentPlayer =
    indexPlayer === game.player1Id[0] ? game.player1Id : game.player2Id;

  if (!currentPlayer) {
    console.error(`Игрок с ID ${indexPlayer} не найден в игре.`);
    return;
  }


  const turn = {
    type: "turn",
    data:
    {
      currentPlayer: indexPlayer,
    },
    id: 0,
  }
  const startMessage = {
    type: "start_game",
    data: {
      ships: ships,
      currentPlayerIndex: indexPlayer,
    },
    id: 0,
  };

  console.log("Отправка сообщения игроку:", startMessage);

  currentPlayer[1].send(JSON.stringify({ ...startMessage, data: JSON.stringify(startMessage.data) }));
  currentPlayer[2] = true;

  if (game.player1Id[2] === true && game.player2Id[2] === true) {

    game.player1Id[1].send(JSON.stringify({ ...turn, data: JSON.stringify({ ...turn.data, currentPlayerIndex: game.player1Id[0] }) }));
    game.player2Id[1].send(JSON.stringify({ ...turn, data: JSON.stringify({ ...turn.data, currentPlayerIndex: game.player2Id[0] }) }));
  }
}
