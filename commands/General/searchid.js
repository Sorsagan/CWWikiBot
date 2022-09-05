const { EmbedBuilder } = require("discord.js"); 
const fs = require('fs')
const path = require('path')
datapath = path.resolve('data.json')


module.exports = {
  config: {
    name: "searchid",
    description: "Search for items with their IDs!",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {
    if (args.toString().length > 3){
        message.reply("Sorry this ID is invalid!")
    }
    if (args.length > 1){
        message.reply("Sorry this ID is invalid!")
    }
    if (/[a-zA-Z]/i.test(args) == true){
        message.reply("Sorry this ID is invalid!")
    }
    fs.readFile(datapath, 'utf-8', (err, data) => {
      if (err) {
          throw err;
      }
      const jsondata = JSON.parse(data.toString());
      for (var i = 0; i < jsondata.length; i++){
        if (jsondata[i].itemid == args){
            const argsforurl = jsondata[i].names.replace(/ /g, "_")
      message.reply({ embeds: [
        new EmbedBuilder()
          .setURL(`https://cubixworlds.fandom.com/wiki/${argsforurl}`)
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