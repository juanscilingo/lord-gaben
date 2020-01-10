import { Attachment } from "discord.js";
import stringSimilarity from 'string-similarity';

const handler = (msg, args) => { 
  msg.channel.send(`Este antro esta cerrado por ahora..`);
  return;
  
  console.log(args);
  const response = global.hero_responses.find(s => stringSimilarity.compareTwoStrings(s.text, args.join(' ')) > 0.5);
  const attachment = new Attachment(response.audio);
  msg.channel.send(`${response.hero_name}: *${response.text}*`, attachment);
}

export default {
  matchers: ['response', 'r'],
  handler
}