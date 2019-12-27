import dotenv from 'dotenv';

console.log('NODE_ENV: ', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'development')
  dotenv.config();
else {
  const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
  dotenv.config({ path: envFile });
}

export default {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  PREFIX: process.env.PREFIX || '!',
  DOTA_PLAYERS: process.env.DOTA_PLAYERS ? process.env.DOTA_PLAYERS.split(',') : [],
  MATCHES_CHANNEL_ID: process.env.MATCHES_CHANNEL_ID
}