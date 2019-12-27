import * as recruitService from '../services/recruit';

const handler = (message, args) => {
  const response = recruitService.removeUsers(args.length ? args : [message.author.username]);
  message.channel.send(response);
}

export default {
  matchers: ['out'],
  handler
}