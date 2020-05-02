import env from './env';
import AWS from 'aws-sdk';
import { getUsers } from './db/users';
import { getHeroResponses } from './db/hero-responses';

const commandsPath = require("path").join(__dirname, "commands");
const commands = require("fs").readdirSync(commandsPath).map(file => require("./commands/" + file).default);
const tasksPath = require("path").join(__dirname, "tasks");
const tasks = require("fs").readdirSync(tasksPath).map(file => require("./tasks/" + file).default);

export default async () => {
  console.log('Booting...');

  // AWS
  console.log('Configuring AWS...');
  AWS.config.update({
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION
  })
  global.db = new AWS.DynamoDB.DocumentClient();

  console.log('Fetching Users...');
  global.users = await getUsers();
  // console.log('Fetching HeroResponses...');
  // global.hero_responses = await getHeroResponses();
  
  // COMMANDS
  console.log('Configuring commands...');
  global.client.on('message', async message => {
    if (message.author.bot || !message.content.startsWith(env.PREFIX))
      return;

    console.log(`Received message by ${message.author.username}: ${message.content}`);

    const args = message.content.slice(env.PREFIX.length).trim().split(/ +/g);
    const issuedCommand = args.shift().toLowerCase();

    try {
      const command = commands.find(command => command.matchers.some(matcher => matcher === issuedCommand));
      if (command) {
        await message.react('⏳');
        await command.handler(message, args);
        await message.clearReactions();
        await message.react('✅');
      }
    } catch (err) {
      await message.clearReactions();
      await message.react('❌');
      message.channel.send('Whoops, a wild error appeared');
      console.error(err);
    }
  })

  // TASKS
  console.log('Configuring tasks...');
  for (const task of tasks) {
    const runTask = () => {
      try {
        task.handler();
      } catch (err) {
        console.error('Error when running task: ', err);
      }
    }
    runTask();
    setInterval(runTask, task.interval);
  }

  console.log('Finished booting');
}