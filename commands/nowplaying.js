const { EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "nowplaying",
  description: "Obtenir des informations sur la chanson en cours.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    try {

      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: `<a:awarning:1222570208519127124> Aucune musique ne joue !!`, ephemeral: true }).catch(e => { })

      const track = queue.songs[0];
      if (!track) return interaction.reply({ content: `<a:awarning:1222570208519127124> Aucune musique ne joue!!`, ephemeral: true }).catch(e => { })

      const embed = new EmbedBuilder();
      embed.setColor(client.config.embedColor);
      embed.setThumbnail(track.thumbnail);
      embed.setTitle(track.name)
      embed.setDescription(`> <:PRO_FIBRE:1226227838470979686> **Audio** \`%${queue.volume}\`
> <:PRO_CLOCK:1222568766668542095> **Durée :** \`${track.formattedDuration}\`
> <a:PRO_LIEN:1221494488279552042> **URL :** **${track.url}**
> <a:PRO_RT:1226483659268165632> **Mode "en boucle" :** \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Toute la file d\'attente' : 'Cette chanson') : 'Désactivé'}\`
> <:PRO_WORK:1221868404122583111> **Filtre**: \`${queue.filters.names.join(', ') || 'Désactivé'}\`
> <a:PRO_MEMBRE:1222967753569337355> **Par :** <@${track.user.id}>`);


      interaction.reply({ embeds: [embed] }).catch(e => { })

    }  catch (e) {
    console.error(e); 
  }
  },
};
