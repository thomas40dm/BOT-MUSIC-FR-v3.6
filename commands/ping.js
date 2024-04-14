
const { EmbedBuilder } = require('discord.js')
const db = require("../mongoDB");
module.exports = {
  name: "ping",
  description: "Vérifier la latence du bot",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {


    try {

      const start = Date.now();
      interaction.reply("Ping....").then(msg => {
        const end = Date.now();
        const embed = new EmbedBuilder()
          .setColor(`#2b2d31`)
          .setTitle(`Latence des robots`)
          .setDescription(`**Pong** : ${end - start}ms`)
        return interaction.editReply({ embeds: [embed] }).catch(e => { });
      }).catch(err => { })

    } catch (e) {
    console.error(e); 
  }
  },
};