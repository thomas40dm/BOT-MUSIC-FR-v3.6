
const db = require("../mongoDB");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "autoplay",
  description: "Activer/désactiver la lecture automatique de la file d'attente.",
  options: [],
  permissions: "0x0000000000000800",
  run: async (client, interaction) => {
    try {
      const queue = client?.player?.getQueue(interaction?.guild?.id);
      if (!queue || !queue?.playing) {
        return interaction?.reply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue !!', ephemeral: true });
      }
      
      queue?.toggleAutoplay();
      
      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setTitle('Votre musique, votre appel !!')
        .setDescription(queue?.autoplay ? '**<:PRO_CHECKMARK:1222535886437224480> Lecture automatique activée**' : '**<:PRO_OUT:1223462369154302043> Lecture automatique désactivée**')
        
      
      interaction?.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
    }
  },
};
