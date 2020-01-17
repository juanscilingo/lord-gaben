import * as stratz from '../services/stratz';
import * as usersUtils from '../utils/users';

const ALL_TRIGGER = 'all'

const handler = async (message, args) => {
  let playerId;

  if (args[0] === ALL_TRIGGER) {
    message.channel.send(await stratz.recentAll());
    return;
  }

  if (args.length > 1) {
    message.channel.send('Too many arguments');
    return;
  }

  if (args.length) { 
    if (isNaN(args[0])) {
      const user = usersUtils.getUserByNameOrAlias(args[0]);
      if (!user) {
        message.channel.send(`Player \`${args[0]}\` could not be found`);
        return;
      } else {
        playerId = user.dota_profile_id;
      }
    } else {
      playerId = args[0];
    }
  } else {
    const user = usersUtils.getUserById(message.author.id);
    if (!user) {
      message.channel.send(`I couldn't find your dota profile ID, you can specify it as a paremeter: \`!recent <your_dota_profile_id>\``);
      return;
    }
    else {
      playerId = user.dota_profile_id;
    }
  }

  const response = await stratz.recentMatchesSummary(playerId);
  message.channel.send(response);
}

export default {
  matchers: ['recent', 'r'],
  handler
}