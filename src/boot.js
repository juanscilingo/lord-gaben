import env from './env';

const commandsPath = require("path").join(__dirname, "commands");
const commands = require("fs").readdirSync(commandsPath).map(file => require("./commands/" + file).default);

export default () => {
  global.client.on('message', message => {
    if (message.author.bot || !message.content.startsWith(env.PREFIX))
      return;

    console.log(`Received message by ${message.author.username}: ${message.content}`)
    const issuedCommand = message.content.startsWith(env.PREFIX) ? message.content.slice(env.PREFIX.length, message.content.length) : message.content;
    commands.filter(command => command.matchers.some(matcher => matcher.match(issuedCommand))).forEach(command => command.handler(message));
  })
}