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
  MATCHES_CHANNEL_ID: process.env.MATCHES_CHANNEL_ID,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  USERS_TABLE: process.env.USERS_TABLE,
  HERO_RESPONSES_TABLE: process.env.HERO_RESPONSES_TABLE,
  OPEN_DOTA_API_KEY: process.env.OPEN_DOTA_API_KEY
}