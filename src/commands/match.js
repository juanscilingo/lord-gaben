import * as openDota from '../services/open-dota';

const handler = async (message, args) => {
  const matchId = args[0];
  if (isNaN(matchId)) {
    message.channel.send('Invalid match id');
    return;
  }

  const match = await openDota.getMatch(matchId);

  if (!match)
    message.channel.send('Match not found')
  else if (!match.version)
    message.channel.send(`Match ${match.match_id} has not been parsed yet`)
  else {
    const matchOverview = openDota.getMatchOverview(match);
    message.channel.send(matchOverview);
  }
}

export default {
  matchers: ['match'],
  handler
}