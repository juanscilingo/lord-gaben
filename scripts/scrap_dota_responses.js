const dotenv = require('dotenv');
const argv = require('yargs').argv;
const axios = require('axios');
const cheerio = require('cheerio');
const aguid = require('aguid');
const AWS = require('aws-sdk');
const { splitArrayInChunks } = require('./utils');

dotenv.config({ path: argv.env ? `.env.${argv.env}` : '.env' })

if (!process.env.HERO_RESPONSES_TABLE) {
  console.log('HERO_RESPONSES_TABLE config missing in env file');
  process.exit(0);
}

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const db = new AWS.DynamoDB.DocumentClient();

const BASE_URL = 'https://dota2.gamepedia.com'
const RESPONSES_URL = `${BASE_URL}/Category:Responses`;
const HEROES = ["Abaddon","Alchemist","Axe","Beastmaster","Brewmaster","Bristleback","Centaur Warrunner","Chaos Knight","Clockwerk","Doom","Dragon Knight","Earth Spirit","Earthshaker","Elder Titan","Huskar","Io","Kunkka","Legion Commander","Lifestealer","Lycan","Magnus","Mars","Night Stalker","Omniknight","Phoenix","Pudge","Sand King","Slardar","Snapfire","Spirit Breaker","Sven","Tidehunter","Timbersaw","Tiny","Treant Protector","Tusk","Underlord","Undying","Wraith King","Anti-Mage","Arc Warden","Bloodseeker","Bounty Hunter","Broodmother","Clinkz","Drow Ranger","Ember Spirit","Faceless Void","Gyrocopter","Juggernaut","Lone Druid","Luna","Medusa","Meepo","Mirana","Monkey King","Morphling","Naga Siren","Nyx Assassin","Pangolier","Phantom Assassin","Phantom Lancer","Razor","Riki","Shadow Fiend","Slark","Sniper","Spectre","Templar Assassin","Terrorblade","Troll Warlord","Ursa","Vengeful Spirit","Venomancer","Viper","Weaver","Ancient Apparition","Bane","Batrider","Chen","Crystal Maiden","Dark Seer","Dark Willow","Dazzle","Death Prophet","Disruptor","Enchantress","Enigma","Grimstroke","Invoker","Jakiro","Keeper of the Light","Leshrac","Lich","Lina","Lion","Nature's Prophet","Necrophos","Ogre Magi","Oracle","Outworld Devourer","Puck","Pugna","Queen of Pain","Rubick","Shadow Demon","Shadow Shaman","Silencer","Skywrath Mage","Storm Spirit","Techies","Tinker","Visage","Void Spirit","Warlock","Windranger","Winter Wyvern","Witch Doctor","Zeus"]

const run = async () => {
  console.log(`Scrapping ${BASE_URL} for hero response pages...`)
  let $ = cheerio.load((await axios.get(RESPONSES_URL)).data);

  const heroes = $('body').find('.mw-category-group a').toArray()
                          .filter(a => HEROES.includes(a.attribs.title.replace('/Responses', '')))
                          .map(a => ({ name: a.attribs.title.replace('/Responses', ''), url: `${BASE_URL}${a.attribs.href}` }));

  console.log(`Found ${heroes.length} hero response pages`)

  let responses = [];
  
  for (hero of heroes) {
    console.log(`Processing hero '${hero.name}': ${hero.url}`);
    $ = cheerio.load((await axios.get(hero.url)).data);
    const hero_responses = $('.mw-parser-output').find('>ul li').toArray().map(li => {
      const source = $(li).find('source')[0];
      return {
        id: aguid(),
        hero_name: hero.name,
        text: $(li.children[li.children.length - 1]).text().substr(1),
        audio: source ? source.attribs.src : null
      }
    }).filter(r => r.audio && r.text);

    console.log(`Found ${hero_responses.length} responses`)
    responses = [...responses, ...hero_responses];
  }

  console.log(`A total of ${responses.length} responses have been found`)
  console.log('Saving to dynamo...');

  responses = responses.slice(16317, responses.length - 1)

  const put_requests = responses.map(response => ({
    PutRequest: {
      Item: response
    }
  }));

  const batches = splitArrayInChunks(put_requests, 25).map(chunk => ({
    RequestItems: {
      [process.env.HERO_RESPONSES_TABLE]: chunk
    }
  }));

  for (const batch of batches)
    await db.batchWrite(batch).promise().then(() => console.log('Imported 25 items'))

  console.log('All responses were imported successfully');
}

run();