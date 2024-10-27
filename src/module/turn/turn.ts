
 export function turn(data: any, games: Map<any, any>) {
  try {
    const { gameId, indexPlayer } = JSON.parse(data.data.toString());

    const game = games.get(gameId);
    if (!game) {
      console.error(`Game with ID ${gameId} not found.`);
      return;
    }

    const [player1Id, player1Ws] = game.player1Id || [];
    const [player2Id, player2Ws] = game.player2Id || [];

    if (!player1Ws || !player2Ws) {
      console.error("Player not found");
      return;
    }

    const nextPlayer = indexPlayer === player1Id ? player2Id : player1Id;

    const turnMessage = {
      type: "turn",
      data: {
        currentPlayer: nextPlayer,
      },
      id: 0,
    };

    const message = JSON.stringify({ ...turnMessage, data: JSON.stringify({ ...turnMessage.data, currentPlayer: nextPlayer }) }) 

    player1Ws.send(message);
    player2Ws.send(message);
  } catch (error) {
    console.error(error);
  }
}


