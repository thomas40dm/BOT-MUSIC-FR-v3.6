const db = require("../mongoDB");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "resume",
  description: "Démarrer la musique en pause.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild.id);

    try {
      if (!queue) {
        return interaction.reply({ content: '<a:awarning:1222570208519127124> La file d\'attente est vide!!', ephemeral: true });
      }

      if (!queue.paused) {
        return interaction.reply({ content: '<a:awarning:1222570208519127124> Pas de musique en pause!!', ephemeral: true });
      }

      const success = queue.resume();

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({
          name: 'Chanson reprise',
          iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157296313549983846/8929-purple-play-icon.png?ex=651817ae&is=6516c62e&hm=55fc041718da9277d1cdb13ef25ebf043d90588ee33c4bc838d9634ecfbc8e99&',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
        .setDescription(success ? '**La musique reprend vie!!**' : '<:PRO_OUT:1223462369154302043> Erreur : Impossible de reprendre la chanson')
        

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
    }
  },
};
