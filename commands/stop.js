
const db = require("../mongoDB");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "stop",
  description: "Arrête la musique.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    try {
      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) {
        return interaction.reply({ content: ' Aucune musique ne joue!!', ephemeral: true });
      }

      queue.stop(interaction.guild.id);

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({
          name: 'Musique arrêtée',
          iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157305318255116400/pngtree-vector-stop-icon-png-image_4233262.jpg?ex=65182011&is=6516ce91&hm=d5a8ca6010716bae836b025f8d36557a95f14c13a705f65eb09a54161649c795&',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
        .setDescription('**<:PRO_OUT:1223462369154302043> Le voyage s\'arrête, mais le rythme continue.**')
        

      return interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
    }
  },
};

