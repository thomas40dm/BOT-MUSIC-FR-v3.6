const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const maxVol = require("../config.js").opt.maxVol;
const db = require("../mongoDB");

module.exports = {
  name: "volume",
  description: "Vous permet de régler le volume de la musique.",
  permissions: "0x0000000000000800",
  options: [{
    name: 'volume',
    description: 'Tapez le numéro pour régler le volume.',
    type: ApplicationCommandOptionType.Integer,
    required: true
  }],
  voiceChannel: true,
  run: async (client, interaction) => {
    try {
      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) {
        return interaction.reply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue!!', ephemeral: true });
      }

      const vol = parseInt(interaction.options.getInteger('volume'));

      if (!vol) {
        return interaction.reply({
          content: `Volume actuel: **${queue.volume}** <:PRO_FIBRE:1226227838470979686>\nPour modifier le volume, tapez un nombre compris entre \`1\` et \`${maxVol}\`.`,
          ephemeral: true
        });
      }

      if (queue.volume === vol) {
        return interaction.reply({ content: 'Le volume actuel est déjà réglé sur **' + vol + '**!', ephemeral: true });
      }

      if (vol < 1 || vol > maxVol) {
        return interaction.reply({
          content: `Veuillez saisir un chiffre entre \`1\` et \`${maxVol}\`.`,
          ephemeral: true
        });
      }

      const success = queue.setVolume(vol);

      if (success) {
        const embed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setAuthor({
        name: 'Ta musique! Vos règles!',
        iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157528025739563088/5657-volume-icon.png?ex=6518ef7b&is=65179dfb&hm=1797c2830537a28b5c6a57564517cc509146d02383a69fb4239d7b5d55aceeed&', 
        url: 'https://discord.gg/ZCfbtCf5rJ'
    })
          .setDescription(`**Réglage du volume : ** **${vol}/${maxVol}**`);

        return interaction.reply({ embeds: [embed] });
      } else {
        return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Quelque chose s\'est mal passé lors du changement du volume.', ephemeral: true });
      }
    } catch (e) {
      console.error(e);
    }
  },
};
