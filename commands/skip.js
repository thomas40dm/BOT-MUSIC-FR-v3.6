
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "skip",
  description: "Change la musique en cours de lecture.",
  permissions: "0x0000000000000800",
  options: [{
    name: "number",
    description: "Mentionne combien de chansons tu veux sauter",
    type: ApplicationCommandOptionType.Number,
    required: false
  }],
  voiceChannel: true,
  run: async (client, interaction) => {
    
    try {

      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue!!', ephemeral: true }).catch(e => { })

      let number = interaction.options.getNumber('number');
      if (number) {
        if (!queue.songs.length > number) return interaction.reply({ content: '<a:awarning:1222570208519127124> Nombre actuel de chansons dépassé', ephemeral: true }).catch(e => { })
        if (isNaN(number)) return interaction.reply({ content: '<a:awarning:1222570208519127124> Numéro invalide', ephemeral: true }).catch(e => { })
        if (1 > number) return interaction.reply({ content: '<a:awarning:1222570208519127124> Numéro invalide', ephemeral: true }).catch(e => { })

        try {
        let old = queue.songs[0];
        await client.player.jump(interaction, number).then(song => {
          return interaction.reply({ content: `<:PRO_UP:1226227233002356776> Sauté : **${old.name}**` }).catch(e => { })
        })
      } catch(e){
        return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> La file d\'attente est vide!!', ephemeral: true }).catch(e => { })
      }
      } else {
try {
  const queue = client.player.getQueue(interaction.guild.id);
  if (!queue || !queue.playing) {
    return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Aucune musique ne joue !!', ephemeral: true });
  }

  let old = queue.songs[0];
  const success = await queue.skip();

  const embed = new EmbedBuilder()
    .setColor('#2b2d31')
    .setAuthor({
      name: 'Chanson ignorée',
      iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157269773118357604/giphy.gif?ex=6517fef6&is=6516ad76&hm=f106480f7d017a07f75d543cf545bbea01e9cf53ebd42020bd3b90a14004398e&',
      url: 'https://discord.gg/ZCfbtCf5rJ'
    })
    .setDescription(success ? ` **SAUTÉ** : **${old.name}**` : '<:PRO_OUT:1223462369154302043> La file d\'attente est vide!')
    .setTimestamp();

  return interaction.reply({ embeds: [embed] });
}catch (e) {
          return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> La file d\'attente est vide!!', ephemeral: true }).catch(e => { })
        }
      }

    } catch (e) {
    console.error(e); 
  }
  },
};
