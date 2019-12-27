import * as recruitService from '../services/recruit';

const handler = msg => {
  msg.channel.send(recruitService.start(msg.author.username));
}

export default {
  matchers: ['recruit', 'sale'],
  handler
}