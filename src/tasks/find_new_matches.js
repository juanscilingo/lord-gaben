import env from '../env';
import * as openDota from '../services/open-dota';
import moment from 'moment';

const parsedMatches = [];

const handler = async () => {
  console.log('Looking for new dota matches...')

  const fromDate = moment.utc().subtract(30, 'minutes');

  for (const player of env.DOTA_PLAYERS) {
    for (const match of await openDota.getRecentMatches(player)) {
      if (!parsedMatches.includes(match.match_id)) {
        const endDate = moment.utc((match.start_time + match.duration) * 1000);
        if (endDate > fromDate) {
          const matchData = await openDota.getMatch(match.match_id);
          if (matchData && matchData.version) {
            console.log('Parsing match: ', match.match_id)
            const overview = await openDota.getMatchOverview(m);
            global.client.channels.get(env.MATCHES_CHANNEL_ID).send(overview);
            parsedMatches.push(match.match_id);
          }
        }
      }
    }
  }
}

export default {
  interval: 1000 * 60,
  handler
}