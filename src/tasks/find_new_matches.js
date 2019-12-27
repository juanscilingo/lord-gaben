import env from '../env';
import * as openDota from '../services/open-dota';
import moment from 'moment';

const handler = async () => {
  console.log('Looking for new dota matches...')

  const fromDate = moment.utc().subtract(30, 'minutes');
  let newMatches = [];

  for (const player of env.DOTA_PLAYERS) {
    const playerMatches = await openDota.recentMatches(player);
    newMatches = newMatches.concat(playerMatches.filter(m =>
      !newMatches.includes(newMatch => newMatch.match_id === m.match_id) &&
      moment.utc((m.start_time + m.duration) * 1000) > fromDate
    ))
  }

  console.log(`Found ${newMatches.length} matches: ${newMatches.map(m => m.match_id).join(', ')}`);

  for (const match of newMatches) {
    const matchOverview = await openDota.getMatchOverview(match.match_id);
    global.client.channels.get(env.MATCHES_CHANNEL_ID).send(matchOverview);
  }
}

export default {
  interval: 1000 * 60 * 5,
  handler
}