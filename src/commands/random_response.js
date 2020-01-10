import { Attachment } from "discord.js";

const handler = msg => { 
  msg.channel.send(`Este antro esta cerrado por ahora..`);
  return;

  const random_response = global.hero_responses[Math.floor(Math.random() * global.hero_responses.length)];
  const attachment = new Attachment(random_response.audio);
  msg.channel.send(`${random_response.hero_name}: *${random_response.text}*`, attachment);
}

export default {
  matchers: ['random_response', 'rr'],
  handler
}