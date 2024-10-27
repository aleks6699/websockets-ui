export function updateWinners(winners: any, users: Map<any, any>) {
  for (const user of users.values()) {
    user.ws.send(JSON.stringify({ ...winners, data: JSON.stringify(winners.data) }));
  }
}