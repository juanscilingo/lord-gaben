import * as openDota from '../services/open-dota';

const handler = async (message, args) => {
  const matchId = args[0];
  if (isNaN(matchId)) {
    message.channel.send('Invalid match id');
    return;
  }

  const matchOverview = await openDota.getMatchOverview(matchId);

  if (!matchOverview)
    message.channel.send('Match not found');
  else
    message.channel.send(matchOverview);
}

export default {
  matchers: ['match'],
  handler
}