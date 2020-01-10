import * as stratz from '../services/stratz';

const handler = async (message, args) => {
  const matchId = args[0];
  if (isNaN(matchId)) {
    message.channel.send('Invalid match id');
    return;
  }

  const match = await stratz.match(matchId);

  if (!match)
    message.channel.send('Match not found')
  else if (!match.parsedDateTime)
    message.channel.send(`Match ${match.match_id} has not been parsed yet`)
  else {
    const matchOverview = stratz.getMatchOverview(match);
    message.channel.send(`<https://www.opendota.com/matches/${matchId}>   -   <https://stratz.com/en-us/match/${matchId}>`);
    message.channel.send(matchOverview);
  }
}

export default {
  matchers: ['match', 'm'],
  handler
}