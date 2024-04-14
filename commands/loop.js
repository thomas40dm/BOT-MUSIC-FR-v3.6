
const db = require("../mongoDB");
module.exports = {
  name: "loop",
  description: "Activer ou désactiver le mode boucle musicale.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    
    try {
      const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue!!', ephemeral: true }).catch(e => { })
  
      let button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("File d'attente")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("queue"),
        new ButtonBuilder()
          .setLabel("Morceau en cours")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("nowplaying"),
        new ButtonBuilder()
          .setLabel("Arrêtez la boucle !")
          .setStyle(ButtonStyle.Danger)
          .setCustomId("close")
      )

      const embed = new EmbedBuilder()
        .setColor('#2b2d31')
        .setAuthor({
        name: 'Bouclez vos mélodies',
        iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157318080670728283/7905-repeat.gif?ex=65182bf4&is=6516da74&hm=9ae58f40fcea5dc42a2a992bbd159d50116b3bafe5c5f7728e3a5276442efd2a&', 
        url: 'https://discord.gg/ZCfbtCf5rJ'
    })
        .setDescription('**En boucle! Laissez la musique jouer encore et encore.**')
     
      interaction?.reply({ embeds: [embed], components: [button], fetchReply: true }).then(async Message => {

        const filter = i => i.user.id === interaction.user.id
        let col = await Message.createMessageComponentCollector({ filter, time: 120000 });

        col.on('collect', async (button) => {
          if (button.user.id !== interaction.user.id) return
          const queue1 = client.player.getQueue(interaction.guild.id);
          if (!queue1 || !queue1.playing) {
            await interaction?.editReply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue!!', ephemeral: true }).catch(e => { })
            await button?.deferUpdate().catch(e => {})
          }
          switch (button.customId) {
            case 'queue':
              const success = queue.setRepeatMode(2);
              interaction?.editReply({ content: `<a:SP_loading:1223443458090471594> File d'attente en boucle !!` }).catch(e => { })
              await button?.deferUpdate().catch(e => {})
              break
            case 'nowplaying':
              const success2 = queue.setRepeatMode(1);
              interaction?.editReply({ content: `<:PRO_CHECKMARK:1222535886437224480> Boucle activée!!` }).catch(e => { })
              await button?.deferUpdate().catch(e => {})
              break
            case 'close':
              if (queue.repeatMode === 0) {
                await button?.deferUpdate().catch(e => {})
                return interaction?.editReply({ content: '<:PRO_OUT:1223462369154302043> Boucle déjà désactivée !!', ephemeral: true }).catch(e => { })
              }
              const success4 = queue.setRepeatMode(0);
              interaction?.editReply({ content: '<a:PRO_RT:1226483659268165632> Looping off' }).catch(e => { })
              await button?.deferUpdate().catch(e => {})
              break
          }
        })
        col.on('end', async (button) => {
          button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setLabel("Timeout")
              .setCustomId("timeend")
              .setDisabled(true))

          const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setTitle('<a:PRO_RT:1226483659268165632> Boucle!!')
            .setTimestamp()

          await interaction?.editReply({ content: "", embeds: [embed], components: [button] }).catch(e => { });
        })
      }).catch(e => { })

    } catch (e) {
    console.error(e); 
  }
  }
}
