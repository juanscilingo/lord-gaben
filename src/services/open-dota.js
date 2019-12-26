import Axios from "axios";
import { table } from 'table';
import moment from 'moment';
import { codeBlock } from '../utils/markdown';

const OPEN_DOTA_API_URL = 'https://api.opendota.com/api';
const axios = Axios.create({ baseURL: OPEN_DOTA_API_URL });

export const match = async id => {
  console.log('Fetching match id: ', id)
  try {
    const match = await axios.get(`matches/${id}`);
    return match.data;
  } catch (error) {
    throw error;
  }
}

export const matchOverview = match => {
  const headers = ['Player', 'Hero', 'Lane', 'LVL', 'K', 'D', 'A', 'LH/DN@10', 'EFF@10', 'GPM/XPM', 'HD', 'TD', 'Gold', 'Rank'];
  const data = match.players.map(player => [
    player.personaname || 'Anonymous',
    HEROES[player.hero_id],
    LANE[player.lane_role],
    player.level, 
    player.kills, 
    player.deaths, 
    player.assists, 
    `${player.lh_t[10]}/${player.dn_t[10]}`,
    parseFloat(player.lane_efficiency).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }),
    `${player.gold_per_min}/${player.xp_per_min}`,
    player.hero_damage,
    player.tower_damage,
    player.total_gold,
    player.rank_tier ? getRank(player.rank_tier) : 'Unknown'
  ]);

  const lineIndexes = [1, 6];

  const playersTable = table([headers, ...data], {
    border: {
      bodyLeft: '',
      bodyRight: '',
      joinLeft: '',
      joinRight: '',
    },
    drawHorizontalLine: (index, size) => lineIndexes.includes(index),
    columns: {
      0: { width: 22, truncate: 20 }
    },
  });

  const description = `${match.radiant_score} - ${match.dire_score} in ${moment.utc(match.duration * 1000).format(match.duration > 3600 ? 'hh:mm:ss' : 'mm:ss')} - Game Mode: ${GAME_MODE[match.game_mode]} - Lobby: ${LOBBY_TYPE[match.lobby_type]} - Skill: ${SKILL[match.skill]} - Winner: ${match.radiant_win ? 'Radiant' : 'Dire'}`
  
  return codeBlock(`${description}\n\n${playersTable}`);
}

// CONSTANTS
export const SKILL = {
  0: 'Normal skill',
  1: 'High skill',
  2: 'Very high skill'
}

export const LOBBY_TYPE = {
  0: 'Normal',
  1: 'Practice',
  2: 'Tournament',
  3: 'Tutorial',
  4: 'Co-op Bots',
  5: 'Ranked Teams',
  6: 'Ranked Solo',
  7: 'Ranked',
  8: '1v1 Mid',
  9: 'Battle Cup'
}

export const GAME_MODE = {
  0: 'Unknown',
  1: 'All Pick',
  2: 'Captains Mode',
  3: 'Random Draft',
  4: 'Single Draft',
  5: 'All Random',
  6: 'Intro',
  7: 'Diretide',
  8: 'Reverse Captains Mode',
  9: 'Greeviling',
  10: 'Tutorial',
  11: 'Mid Only',
  12: 'Least Played',
  13: 'Limited Heroes',
  14: 'Compendium Matchmaking',
  15: 'Custom',
  16: 'Captains Draft',
  17: 'Balanced Draft',
  18: 'Ability Draft',
  19: 'Event',
  20: 'Random Deathmatch',
  21: '1v1 Mid',
  22: 'All Draft',
  23: 'Turbo',
  24: 'Mutation',
}

export const RANKS = {
  1: 'Herald',
  2: 'Guardian',
  3: 'Crusader',
  4: 'Archon',
  5: 'Legend',
  6: 'Ancient',
  7: 'Divine',
  8: 'Immortal',
}

export const HEROES = {
  1: 'Anti-Mage',
  2: 'Axe',
  3: 'Bane',
  4: 'Bloodseeker',
  5: 'Crystal Maiden',
  6: 'Drow Ranger',
  7: 'Earthshaker',
  8: 'Juggernaut',
  9: 'Mirana',
  10: 'Morphling',
  11: 'Shadow Fiend',
  12: 'Phantom Lancer',
  13: 'Puck',
  14: 'Pudge',
  15: 'Razor',
  16: 'Sand King',
  17: 'Storm Spirit',
  18: 'Sven',
  19: 'Tiny',
  20: 'Vengeful Spirit',
  21: 'Windranger',
  22: 'Zeus',
  23: 'Kunkka',
  25: 'Lina',
  26: 'Lion',
  27: 'Shadow Shaman',
  28: 'Slardar',
  29: 'Tidehunter',
  30: 'Witch Doctor',
  31: 'Lich',
  32: 'Riki',
  33: 'Enigma',
  34: 'Tinker',
  35: 'Sniper',
  36: 'Necrophos',
  37: 'Warlock',
  38: 'Beastmaster',
  39: 'Queen of Pain',
  40: 'Venomancer',
  41: 'Faceless Void',
  42: 'Wraith King',
  43: 'Death Prophet',
  44: 'Phantom Assassin',
  45: 'Pugna',
  46: 'Templar Assassin',
  47: 'Viper',
  48: 'Luna',
  49: 'Dragon Knight',
  50: 'Dazzle',
  51: 'Clockwerk',
  52: 'Leshrac',
  53: 'Natures Prophet',
  54: 'Lifestealer',
  55: 'Dark Seer',
  56: 'Clinkz',
  57: 'Omniknight',
  58: 'Enchantress',
  59: 'Huskar',
  60: 'Night Stalker',
  61: 'Broodmother',
  62: 'Bounty Hunter',
  63: 'Weaver',
  64: 'Jakiro',
  65: 'Batrider',
  66: 'Chen',
  67: 'Spectre',
  68: 'Ancient Apparition',
  69: 'Doom',
  70: 'Ursa',
  71: 'Spirit Breaker',
  72: 'Gyrocopter',
  73: 'Alchemist',
  74: 'Invoker',
  75: 'Silencer',
  76: 'Outworld Devourer',
  77: 'Lycan',
  78: 'Brewmaster',
  79: 'Shadow Demon',
  80: 'Lone Druid',
  81: 'Chaos Knight',
  82: 'Meepo',
  83: 'Treant Protector',
  84: 'Ogre Magi',
  85: 'Undying',
  86: 'Rubick',
  87: 'Disruptor',
  88: 'Nyx Assassin',
  89: 'Naga Siren',
  90: 'Keeper of the Light',
  91: 'Io',
  92: 'Visage',
  93: 'Slark',
  94: 'Medusa',
  95: 'Troll Warlord',
  96: 'Centaur Warrunner',
  97: 'Magnus',
  98: 'Timbersaw',
  99: 'Bristleback',
  100: 'Tusk',
  101: 'Skywrath Mage',
  102: 'Abaddon',
  103: 'Elder Titan',
  104: 'Legion Commander',
  105: 'Techies',
  106: 'Ember Spirit',
  107: 'Earth Spirit',
  108: 'Underlord',
  109: 'Terrorblade',
  110: 'Phoenix',
  111: 'Oracle',
  112: 'Winter Wyvern',
  113: 'Arc Warden',
  114: 'Monkey King',
  119: 'Dark Willow',
  120: 'Pangolier',
  121: 'Grimstroke',
  126: 'Void Spirit',
  128: 'Snapfire',
  129: 'Mars',
}

export const LANE = {
  1: 'Safe',
  2: 'Mid',
  3: 'Off',
  4: 'Jungle'
}

export const getRank = rank => `${RANKS[rank.toString()[0]]}[${rank.toString()[1]}]`;