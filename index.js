const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const config = require("./config/config.json");
const colors = require("colors");
const cheerio = require('cheerio');  
const request = require('request-promise');
const { CWUrls, CWSiteURL } = require('./urls'); 
const fs = require('fs');

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction,
  ],
});

// Host the bot:
require("http")
  .createServer((req, res) => res.end("Ready."))
  .listen(3000);

// Getting the bot token:
const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn(
    "[CRASH] Authentication Token for Discord bot is required! Use Envrionment Secrets or config.json."
      .red + "\n"
  );
  return process.exit();
}

// Handler:
client.commands = new Collection();
client.slashcmds = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "slash", "events", "mongoose"].forEach((file) => {
  require(`./handlers/${file}`)(client);
});

// Login to the bot:
client.login(AuthenticationToken).catch((err) => {
  console.warn(
    "[CRASH] Something went wrong while connecting to your bot..." + "\n"
  );
  console.warn("[CRASH] Error from Discord API:" + err);
  process.exit();
});


async function CWScraper(){
  let dataArr = []
  for(let i= 0; i<CWUrls.length ; i++){
      const response = await request(CWUrls[i])
      let $ = cheerio.load(response)
      let names = $('h2[class="pi-item pi-item-spacing pi-title pi-secondary-background"]').text()
      let image = $('figure[class="pi-item pi-image"] > a[class="image image-thumbnail"] > img[class="pi-image-thumbnail"]').attr('src')
      let itemtype = $('div[class="pi-data-value pi-font"]:first').text()
      let itemid = $('div[class="pi-data-value pi-font"]').slice(1).eq(0).text()
      let itemrarity = $('div[class="pi-data-value pi-font"]').slice(2).eq(0).text()
      let itemfarmable = $('div[class="pi-data-value pi-font"]').slice(3).eq(0).text()
      let itemdroppable = $('div[class="pi-data-value pi-font"]').slice(4).eq(0).text()
      let dataObj = {
          names,
          itemtype,
          itemid,
          itemrarity,
          itemfarmable,
          itemdroppable,
          image
      }
      dataArr.push(dataObj)
  }
  fs.writeFileSync( "./data.json" , JSON.stringify(dataArr, null , 4), {encoding: 'utf-8'});
  console.log(dataArr)
}
CWScraper()

async function CWSiteScraper(){
  let dataArr = []
  for(let i= 0; i<CWSiteURL.length ; i++){
      const response = await request(CWSiteURL[i])
      let $ = cheerio.load(response)
      let onlinecount = $('text[class="online-player"]').text()
      let dataObj = {
          onlinecount
      }
      dataArr.push(dataObj)
  }
  fs.writeFileSync( "./onlinecount.json" , JSON.stringify(dataArr, null , 4), {encoding: 'utf-8'});
  console.log(dataArr.slice("  "))
}
CWSiteScraper()