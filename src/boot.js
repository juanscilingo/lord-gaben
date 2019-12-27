import env from './env';

const commandsPath = require("path").join(__dirname, "commands");
const commands = require("fs").readdirSync(commandsPath).map(file => require("./commands/" + file).default);
const tasksPath = require("path").join(__dirname, "tasks");
const tasks = require("fs").readdirSync(tasksPath).map(file => require("./tasks/" + file).default);

export default () => {
  // COMMANDS
  global.client.on('message', message => {
    if (message.author.bot || !message.content.startsWith(env.PREFIX))
      return;

    console.log(`Received message by ${message.author.username}: ${message.content}`);

    const args = message.content.slice(env.PREFIX.length).trim().split(/ +/g);
    const issuedCommand = args.shift().toLowerCase();

    try {
      commands.filter(command => command.matchers.some(matcher => matcher === issuedCommand)).forEach(command => command.handler(message, args));
    } catch (err) {
      message.channel.send('Whoops, a wild error appeared');
      console.error(err);
    }
  })

  // PROCESSES
  for (const task of tasks) {
    task.handler();
    setInterval(task.handler, task.interval);
  }
}