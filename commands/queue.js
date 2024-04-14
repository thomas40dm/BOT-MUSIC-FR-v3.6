
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "queue",
  description: "Il vous montre la liste d'attente.",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction) => {
    
    try {

     const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: '<a:awarning:1222570208519127124> Aucune musique ne joue!!', ephemeral: true }).catch(e => { })
      if (!queue.songs[0]) return interaction.reply({ content: '<a:awarning:1222570208519127124> La file d\'attente est vide!!', ephemeral: true }).catch(e => { })

      const trackl = []
      queue.songs.map(async (track, i) => {
        trackl.push({
          title: track.name,
          author: track.uploader.name,
          user: track.user,
          url: track.url,
          duration: track.duration
        })
      })

      const backId = "emojiBack"
      const forwardId = "emojiForward"
      const backButton = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        emoji: "<:PRO_LEFT:1226240157066199120>",
        customId: backId
      });

      const deleteButton = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        emoji: "<:PRO_STOPSTREAM:1226240314369380424>",
        customId: "close"
      });

      const forwardButton = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        emoji: "<:PRO_RIGHT:1221477527449632779>",
        customId: forwardId
      });


      let kaçtane = 8
      let page = 1
      let a = trackl.length / kaçtane

      const generateEmbed = async (start) => {
        let sayı = page === 1 ? 1 : page * kaçtane - kaçtane + 1
        const current = trackl.slice(start, start + kaçtane)
        if (!current || !current?.length > 0) return interaction.reply({ content: '<a:awarning:1222570208519127124> La file d\'attente est vide!!', ephemeral: true }).catch(e => { })
        return new EmbedBuilder()
          .setTitle(`${interaction.guild.name}  Queue`)
          .setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }))
          .setColor(client.config.embedColor)
          .setDescription(`<:PRO_RIGHT:1221477527449632779> Maintenant je joue: \`${queue.songs[0].name}\`
    ${current.map(data =>
            `\n\`${sayı++}\` | [${data.title}](${data.url}) | (Exécuté par <@${data.user.id}>)`
          )}`)
          .setFooter({ text: `Page ${page}/${Math.floor(a + 1)}` })
      }

      const canFitOnOnePage = trackl.length <= kaçtane

      await interaction.reply({
        embeds: [await generateEmbed(0)],
        components: canFitOnOnePage
          ? []
          : [new ActionRowBuilder({ components: [deleteButton, forwardButton] })],
        fetchReply: true
      }).then(async Message => {
        const filter = i => i.user.id === interaction.user.id
        const collector = Message.createMessageComponentCollector({ filter, time: 120000 });


        let currentIndex = 0
        collector.on("collect", async (button) => {
          if (button?.customId === "close") {
            collector?.stop()
           return button?.reply({ content: 'Commande annulée', ephemeral: true }).catch(e => { })
          } else {

            if (button.customId === backId) {
              page--
            }
            if (button.customId === forwardId) {
              page++
            }

            button.customId === backId
              ? (currentIndex -= kaçtane)
              : (currentIndex += kaçtane)

            await interaction.editReply({
              embeds: [await generateEmbed(currentIndex)],
              components: [
                new ActionRowBuilder({
                  components: [
                    ...(currentIndex ? [backButton] : []),
                    deleteButton,
                    ...(currentIndex + kaçtane < trackl.length ? [forwardButton] : []),
                  ],
                }),
              ],
            }).catch(e => { })
            await button?.deferUpdate().catch(e => { })
          }
        })

        collector.on("end", async (button) => {
          button = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:PRO_LEFT:1226240157066199120>")
              .setCustomId(backId)
              .setDisabled(true),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:PRO_STOPSTREAM:1226240314369380424>")
              .setCustomId("close")
              .setDisabled(true),
            new ButtonBuilder()
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("<:PRO_RIGHT:1221477527449632779>")
              .setCustomId(forwardId)
              .setDisabled(true))

          const embed = new EmbedBuilder()
            .setTitle('Expiration du délai de commande')
            .setColor(`#2b2d31`)
            .setDescription('<:PRO_RIGHT:1221477527449632779> Exécutez à nouveau la commande Queue!!')
          return interaction?.editReply({ embeds: [embed], components: [button] }).catch(e => { })

        })
      }).catch(e => { })

    } catch (e) {
    console.error(e); 
  }
  }
}
