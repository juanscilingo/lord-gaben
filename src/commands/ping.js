const handler = msg => msg.reply('pong');

export default {
  matchers: ['ping'],
  handler
}