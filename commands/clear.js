
const db = require("../mongoDB");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "clear",
  description: "Efface la file d'attente musicale.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    const queue = client.player.getQueue(interaction.guild.id);
    
    try {
      if (!queue || !queue.playing) {
        return interaction.reply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue!!', ephemeral: true });
      }

      if (!queue.songs[0]) {
        return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> La file d\'attente est vide!!', ephemeral: true });
      }

      await queue.stop(interaction.guild.id);

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({
          name: 'Liste effacée',
          iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157314241393598585/4618-no-slides.png?ex=65182861&is=6516d6e1&hm=dac8fed5a18e1574485e833d4c017591c50f59d161e1bde7fed5f6a92543f951&',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
        .setDescription('**<:PRO_CHECKMARK:1222535886437224480> File d\'attente effacée ! Soyez prêt pour un nouveau voyage musical.**')
       

      interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e); 
    }
  },
};
