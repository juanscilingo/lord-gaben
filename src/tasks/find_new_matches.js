import env from '../env';
import * as stratz from '../services/stratz';
import moment from 'moment';

const parsedMatches = [];

const handler = async () => {
  console.log('Looking for new dota matches...')

  const fromDate = moment.utc().subtract(30, 'minutes');

  try {
    for (const match of await stratz.getRecentMatches(env.DOTA_PLAYERS)) {
      if (!parsedMatches.includes(match.id)) {
        const endDate = moment.utc(match.endDateTime * 1000);
        if (endDate > fromDate) {
          if (match.parsedDateTime) {
            console.log('Parsing match: ', match.id)
            const overview = stratz.getMatchOverview(match);
            const channel = global.client.channels.get(env.MATCHES_CHANNEL_ID);
            channel.send(`<https://www.opendota.com/matches/${match.id}>   -   <https://stratz.com/en-us/match/${match.id}>`);
            channel.send(overview);
            parsedMatches.push(match.id);
          }
        }
      }
    }
  } catch (err) {
    console.error('An error occurred while running find_new_matches task: ', err)
  }
}

export default {
  interval: 1000 * 60 * 5,
  handler
}