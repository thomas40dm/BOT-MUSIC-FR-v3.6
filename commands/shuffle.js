const { EmbedBuilder } = require("discord.js")
const config = require("../config.js");
const db = require("../mongoDB");
module.exports = {
  name: "shuffle",
  description: "Mélangez les chansons de la file d'attente",
  options: [],
  permissions: "0x0000000000000800",
  run: async (client, interaction) => {
    try {

        const queue = client.player.getQueue(interaction.guild.id);
        if (!queue || !queue.playing) return interaction.reply({ content: `<a:awarning:1222570208519127124> Aucune musique ne joue!!`, ephemeral: true }).catch(e => { })
        try {
          queue.shuffle(interaction)
        return interaction.reply({ content: `<@${interaction.user.id}>, J'ai mélangé les chansons pour toi!!` }).catch(e => { })
        } catch(err) {
        return interaction.reply({ content: `**${err}**` }).catch(e => { })
        }
      } catch (e) {
      console.error(e);
    }
  },
};
