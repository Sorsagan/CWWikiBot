const client = require("../../index");
const ActivityType = require("../../index");
const colors = require("colors");
const oc = require("../../onlinecount.json")

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  console.log("\n" + `[READY] ${client.user.tag} is up and ready to go.`.brightGreen);
  client.user.setPresence({
      activities: [{ name: `${oc[0].onlinecount.replace(/\s/g, '')} player is playing!`, type: ActivityType.Watching }],
    status: 'dnd',
  });
})