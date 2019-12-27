import dotenv from 'dotenv';

dotenv.config();

export default {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  PREFIX: process.env.PREFIX || '!',
  DOTA_PLAYERS: process.env.DOTA_PLAYERS ? process.env.DOTA_PLAYERS.split(',') : [],
  MATCHES_CHANNEL_ID: process.env.MATCHES_CHANNEL_ID
}