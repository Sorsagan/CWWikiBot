const { EmbedBuilder } = require("discord.js"); 
const fs = require('fs')
const path = require('path')
datapath = path.resolve('data.json')


module.exports = {
  config: {
    name: "search",
    description: "Search for items!",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    fs.readFile(datapath, 'utf-8', (err, data) => {
      if (err) {
          throw err;
      }
      let argsforurl = args.map(word => {
        return word[0].toUpperCase() + word.slice(1);
    })
      console.log(args.join(" "))
      const jsondata = JSON.parse(data.toString());
      var needle = args.join(" ");
      for (var i = 0; i < jsondata.length; i++){
        if (jsondata[i].names.toLowerCase() == needle.toLowerCase()){
      message.reply({ embeds: [
        new EmbedBuilder()
          .setURL(`https://cubixworlds.fandom.com/wiki/${argsforurl.join("_")}`)
          .setTitle(jsondata[i].names)
          .setThumbnail(jsondata[i].image)
          .setDescription(`Item type: **${jsondata[i].itemtype}**\nItem ID: **${jsondata[i].itemid}**\nRarity: **${jsondata[i].itemrarity}**\nFarmable: **${jsondata[i].itemfarmable}**\nDroppable: **${jsondata[i].itemdroppable}**`)
          .setColor("Green")
      ] })
      break
    }
  }
    })
  },
};