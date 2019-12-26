import Discord from 'discord.js';
import env from './env';

if (!env.DISCORD_TOKEN) {
  console.log('Discord token missing in env file');
  process.exit(0);
}

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
})

client.login(env.DISCORD_TOKEN);