import * as openDota from '../services/open-dota';

const handler = async (message, args) => {
  const matchId = args[0];
  if (isNaN(matchId)) {
    message.channel.send('Invalid match id');
    return;
  }

  const match = await openDota.match(matchId);

  if (!match)
    message.channel.send('Match not found');
  else
    message.channel.send(openDota.matchOverview(match));
}

export default {
  matchers: ['match'],
  handler
}