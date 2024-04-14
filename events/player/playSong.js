const db = require("../../mongoDB");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, queue, song) => {
  if (queue) {
    if (!client.config.opt.loopMessage && queue?.repeatMode !== 0) return;
    if (queue?.textChannel) {
      const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Lecture d\'un morceau en cours',
        iconURL: 'https://cdn.discordapp.com/attachments/1140841446228897932/1144671132948103208/giphy.gif', 
        url: 'https://discord.gg/ZCfbtCf5rJ'
    })
    .setDescription(`\n ‎ \n<:PRO_RIGHT:1221477527449632779> **Détails :** **${song?.name}**\n<:PRO_RIGHT:1221477527449632779> **Profitez de l'expérience musicale ultime. ** \n<:PRO_RIGHT:1221477527449632779> **Si le lien interrompt la lecture, essayez de lancer une requête.**`)
.setImage(queue.songs[0].thumbnail)
    .setColor('#2b2d31')
    .setFooter({ text: 'Plus d\'informations - Utilisez la commande /help [Skea]' });
     
      queue?.textChannel?.send({ embeds: [embed] }).catch(e => { });
    }
  }
}

