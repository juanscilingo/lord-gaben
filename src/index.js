import Discord from 'discord.js';
import env from './env';
import boot from './boot';

if (!env.DISCORD_TOKEN) {
  console.log('Discord token missing in env file');
  process.exit(0);
}

global.client = new Discord.Client();
global.client.on('ready', () => { 
  console.log(`Logged in as ${client.user.tag}`)
  boot();
});


client.login(env.DISCORD_TOKEN);