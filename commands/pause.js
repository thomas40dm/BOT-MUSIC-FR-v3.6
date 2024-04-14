
const db = require("../mongoDB");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "pause",
  description: "Arrête de jouer la musique en cours de lecture.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild.id);

    try {
      if (!queue || !queue.playing) {
        return interaction.reply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue!!', ephemeral: true });
      }

      const success = queue.pause();

      const embed = new EmbedBuilder()
        .setColor('#2b2d31') 
        .setAuthor({
          name: 'Chanson en pause',
          iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157296313013117049/8061-purple-pause-icon.png?ex=651817ae&is=6516c62e&hm=4596c9fab9d8b66de8b5215b2750572ced352eed67440a1134550b846b5693b9&',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
        .setDescription(success ? '**La musique est en pause depuis un moment !!**' : '<:PRO_OUT:1223462369154302043> Erreur de commande : impossible de mettre la chanson en pause')
        

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
    }
  },
};
