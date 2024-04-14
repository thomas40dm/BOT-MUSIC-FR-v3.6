const { ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../mongoDB');

module.exports = {
  name: "playlist",
  description: "Vous permet de gérer les commandes de l'album.",
  options: [
    {
      name: "create",
      description: "Créez un album.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Donnez un nom à votre album",
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "public",
          description: "Vous voulez le rendre public ? Vrai ou faux",
          type: ApplicationCommandOptionType.Boolean,
          required: true
        }
      ]
    },
    {
      name: "delete",
      description: "Vous souhaitez supprimer votre album ?",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Écrivez le nom de votre album à supprimer.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: "add-music",
      description: "Il vous permet d'ajouter des chansons à l'album.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "playlist-name",
          description: "Écrivez un nom d'album.",
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "name",
          description: "Écrivez un nom de chanson ou un lien de chanson.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: "delete-music",
      description: "Il vous permet de supprimer une chanson de l'album.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "playlist-name",
          description: "Écrivez un nom d'album.",
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: "name",
          description: "Écrivez un nom de chanson.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: "list",
      description: "Parcourir les chansons dans un album.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Écrivez un nom d'album.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: "lists",
      description: "Parcourez tous vos albums.",
      type: ApplicationCommandOptionType.Subcommand,
      options: []
    },
    {
      name: "top",
      description: "Albums les plus populaires.",
      type: ApplicationCommandOptionType.Subcommand,
      options: []
    }
  ],
  permissions: "0x0000000000000800",
  run: async (client, interaction) => {
    try {
      let stp = interaction.options.getSubcommand()
      if (stp === "create") {
        let name = interaction.options.getString('name')
        let public = interaction.options.getBoolean('public')
        if (!name) return interaction.reply({ content: '<a:awarning:1222570208519127124> Entrez le nom de l\'album à créer!', ephemeral: true }).catch(e => { })

        const userplaylist = await db.playlist.findOne({ userID: interaction.user.id })

        const playlist = await db.playlist.find().catch(e => { })
        if (playlist?.length > 0) {
          for (let i = 0; i < playlist.length; i++) {
            if (playlist[i]?.playlist?.filter(p => p.name === name)?.length > 0) {
              return interaction.reply({ content: '<a:awarning:1222570208519127124> Album déjà sorti !', ephemeral: true }).catch(e => { })
            }
          }
        }

        if (userplaylist?.playlist?.length >= client.config.playlistSettings.maxPlaylist) return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Limite d\'albums dépassée', ephemeral: true }).catch(e => { })

        const creatingAlbumEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('Création d\'un album')
          .setDescription(`Hey <@${interaction.member.id}>, votre album est en cours de création <a:SP_loading:1223443458090471594>`)
          .setTimestamp();

        // Replying with both content and embed
        await interaction.reply({
          content: '',
          embeds: [creatingAlbumEmbed]
        }).catch(e => {
          console.error('Error sending message:', e);
        });

        await db.playlist.updateOne({ userID: interaction.user.id }, {
          $push: {
            playlist: {
              name: name,
              author: interaction.user.id,
              authorTag: interaction.user.tag,
              public: public,
              plays: 0,
              createdTime: Date.now()
            }
          }
        }, { upsert: true }).catch(e => { })

        const albumCreatedEmbed = new EmbedBuilder()
  .setColor('#2b2d31')
          .setAuthor({
            name: 'Album créé avec succès',
            iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1215554404527116288/7762-verified-blue.gif',
            url: 'https://discord.gg/ZCfbtCf5rJ'
          })
  .setDescription(`Hey <@${interaction.member.id}>, votre album a été créé avec succès! <a:PRO_SHAZAM:1225057642771251282>`)
  .setTimestamp();

// Editing the reply with both content and embed
await interaction.editReply({
  content: '',
  embeds: [albumCreatedEmbed]
}).catch(e => {
  console.error('Error editing reply:', e);
});
      }

      if (stp === "delete") {
        let name = interaction.options.getString('name')
        if (!name) return interaction.reply({ content: '<a:awarning:1222570208519127124> Entrez le nom de l\'album à créer!', ephemeral: true }).catch(e => { })

        const playlist = await db.playlist.findOne({ userID: interaction.user.id }).catch(e => { })
        if (!playlist?.playlist?.filter(p => p.name === name).length > 0) return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Aucun album trouvé', ephemeral: true }).catch(e => { })

        const music_filter = playlist?.musics?.filter(m => m.playlist_name === name)
        if (music_filter?.length > 0){
          await db.playlist.updateOne({ userID: interaction.user.id }, {
            $pull: {
              musics: {
                playlist_name: name
              }
            }
          }).catch(e => { })
        }

       const deletingAlbumEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('Supprimer un album')
          .setDescription(`Hey <@${interaction.member.id}>, votre album est en cours de suppression <a:SP_loading:1223443458090471594>`)
          .setTimestamp();

        // Replying with both content and embed
        await interaction.reply({
          content: '',
          embeds: [deletingAlbumEmbed]
        }).catch(e => {
          console.error('Error sending message:', e);
        });

        await db.playlist.updateOne({ userID: interaction.user.id }, {
          $pull: {
            playlist: {
              name: name
            }
          }
        }, { upsert: true }).catch(e => { })

         const albumDeleteEmbed = new EmbedBuilder()
  .setColor('#2b2d31')
          .setAuthor({
            name: 'Album supprimé avec succès',
            iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1215554404527116288/7762-verified-blue.gif',
            url: 'https://discord.gg/ZCfbtCf5rJ '
          })
  .setDescription(`Hey <@${interaction.member.id}>, votre album a été supprimé avec succès! <a:PRO_ETOILES:1226242026345992252>`)
  .setTimestamp();

// Editing the reply with both content and embed
await interaction.editReply({
  content: '',
  embeds: [albumDeleteEmbed]
}).catch(e => {
  console.error('Error editing reply:', e);
});
      }

      if (stp === "add-music") {
        let name = interaction.options.getString('name')
        if (!name) return interaction.reply({ content: '<a:awarning:1222570208519127124> Entrez le nom de la chanson à rechercher', ephemeral: true }).catch(e => { })
        let playlist_name = interaction.options.getString('playlist-name')
        if (!playlist_name) return interaction.reply({ content: '<a:awarning:1222570208519127124> Entrez le nom de l\'album pour ajouter des chansons', ephemeral: true }).catch(e => { })

        const playlist = await db.playlist.findOne({ userID: interaction.user.id }).catch(e => { })
        if (!playlist?.playlist?.filter(p => p.name === playlist_name).length > 0) return interaction.reply({ content: 'Votre chanson ajoutée!', ephemeral: true }).catch(e => { })

        let max_music = client.config.playlistSettings.maxMusic
        if (playlist?.musics?.filter(m => m.playlist_name === playlist_name).length > max_music) return interaction.reply({ content: "Limite de chansons de l'album atteinte".replace("{max_music}", max_music), ephemeral: true }).catch(e => { })
        let res 
        try{
          res = await client.player.search(name, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
          })
        } catch (e) {
          return interaction.reply({ content: 'Impossible de trouver <:PRO_OUT:1223462369154302043>', ephemeral: true }).catch(e => { })
        }
        if (!res || !res.length || !res.length > 1) return interaction.reply({ content: `Impossible de trouver <:PRO_OUT:1223462369154302043> `, ephemeral: true }).catch(e => { })
        const loadingembed = new EmbedBuilder()
        .setColor('#2b2d31')
       .setAuthor({
          name: 'Chanson ajoutée à votre album',
          iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213430944007061574/6943_Verified.gif',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
        .setDescription(`Hey <@${interaction.member.id}>, votre chanson a été ajoutée avec succès! <a:PRO_ETOILES:1226242026345992252>`)
        .setFooter({ text: 'YouTube - Skea' })
        await interaction.reply({
  content: '',
  embeds: [ loadingembed ] 
}).catch(e => {
  console.error('Error sending message:', e);
});

        const music_filter = playlist?.musics?.filter(m => m.playlist_name === playlist_name && m.music_name === res[0]?.name)
        if (music_filter?.length > 0) return interaction.editReply({ content: '<:PRO_OUT:1223462369154302043> Chanson déjà dans l\'album', ephemeral: true }).catch(e => { })

        await db.playlist.updateOne({ userID: interaction.user.id }, {
          $push: {
            musics: {
              playlist_name: playlist_name,
              music_name: res[0]?.name,
              music_url: res[0]?.url, 
              saveTime: Date.now()
            }
          }
        }, { upsert: true }).catch(e => { })

        await interaction.editReply({ content: `<@${interaction.member.id}>, \`${res[0]?.name}\` ` }).catch(e => { })

      }

      if (stp === "delete-music") {
        let name = interaction.options.getString('name')
        if (!name) return interaction.reply({ content: '<a:awarning:1222570208519127124> Entrez le nom de la chanson à rechercher!', ephemeral: true }).catch(e => { })
        let playlist_name = interaction.options.getString('playlist-name')
        if (!playlist_name) return interaction.reply({ content: '<a:awarning:1222570208519127124> Entrez le nom de l\'album pour supprimer la chanson!', ephemeral: true }).catch(e => { })

        const playlist = await db.playlist.findOne({ userID: interaction.user.id }).catch(e => { })
        if (!playlist?.playlist?.filter(p => p.name === playlist_name).length > 0) return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Aucun album trouvé !', ephemeral: true }).catch(e => { })

        const music_filter = playlist?.musics?.filter(m => m.playlist_name === playlist_name && m.music_name === name)
        if (!music_filter?.length > 0) return interaction.reply({ content: `<:PRO_OUT:1223462369154302043> Aucune chanson trouvée!`, ephemeral: true }).catch(e => { })

         const deletingSongEmbed = new EmbedBuilder()
          .setColor('#2b2d31')
          .setTitle('Supprimer une chanson')
          .setDescription(`Hey <@${interaction.member.id}>, votre chanson est en cours de suppression !`)
          .setTimestamp();

        // Replying with both content and embed
        await interaction.reply({
          content: '',
          embeds: [deletingSongEmbed]
        }).catch(e => {
          console.error('Error sending message:', e);
        });

        await db.playlist.updateOne({ userID: interaction.user.id }, {
          $pull: {
            musics: {
              playlist_name: playlist_name,
              music_name: name
            }
          }
        }, { upsert: true }).catch(e => { })

         const songDeleteEmbed = new EmbedBuilder()
  .setColor('#2b2d31')
          .setAuthor({
            name: 'Chanson supprimée avec succès',
            iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1215554404527116288/7762-verified-blue.gif',
            url: 'https://discord.gg/ZCfbtCf5rJ'
          })
  .setDescription(`Hey <@${interaction.member.id}>, votre chanson a été supprimée avec succès! <a:PRO_ETOILES:1226242026345992252>`)
  .setTimestamp();

// Editing the reply with both content and embed
await interaction.editReply({
  content: '',
  embeds: [songDeleteEmbed]
}).catch(e => {
  console.error('Error editing reply:', e);
});
      }

      if (stp === "list") {
        let name = interaction.options.getString('name')
        if (!name) return interaction.reply({ content: '<a:awarning:1222570208519127124> Entrez le nom de l\'album pour le trouver!', ephemeral: true }).catch(e => { })

        let trackl

        const playlist = await db.playlist.find().catch(e => { })
        if (!playlist?.length > 0) return interaction.reply({ content: `<:PRO_STOPSTREAM:1226240314369380424> Aucun nom d'album!`, ephemeral: true }).catch(e => { })

        let arr = 0
        for (let i = 0; i < playlist.length; i++) {
          if (playlist[i]?.playlist?.filter(p => p.name === name)?.length > 0) {

            let playlist_owner_filter = playlist[i].playlist.filter(p => p.name === name)[0].author
            let playlist_public_filter = playlist[i].playlist.filter(p => p.name === name)[0].public

            if (playlist_owner_filter !== interaction.member.id) {
              if (playlist_public_filter === false) {
                return interaction.reply({ content: '<:PRO_STOPSTREAM:1226240314369380424> Vous ne pouvez pas lire cet album!', ephemeral: true }).catch(e => { })
              }
            }

            trackl = await playlist[i]?.musics?.filter(m => m.playlist_name === name)
            if (!trackl?.length > 0) return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Cet album est vide, ajoutez-y des chansons !', ephemeral: true }).catch(e => { })

          } else {
            arr++
            if (arr === playlist.length) {
              return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Aucun album trouvé', ephemeral: true }).catch(e => { })
            }
          }
        }

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
          if (!current || !current?.length > 0) return interaction.reply({ content: '<:PRO_OUT:1223462369154302043> Votre album est vide, ajoutez-y des chansons!', ephemeral: true }).catch(e => { })
          return new EmbedBuilder()
           .setAuthor({
          name: 'Chansons de l\'album',
          iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213422313035407360/8218-alert.gif',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
            .setThumbnail(interaction.user.displayAvatarURL({ size: 2048, dynamic: true }))
            .setColor(client.config.embedColor) 
            .setDescription(`\n${current.map(data =>
              `\n\`${sayı++}\` | [${data.music_name}](${data.music_url}) - <t:${Math.floor(data.saveTime / 1000) }:R>`
            ) }`)
            .setFooter({ text: `Section ${page}/${Math.floor(a+1) }` })
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
          const collector = Message.createMessageComponentCollector({ filter, time: 65000 });


          let currentIndex = 0
          collector.on("collect", async (button) => {
            if (button.customId === "close") {
              collector.stop()
              return button.reply({ content: `Commande annulée <:PRO_OUT:1223462369154302043>`, ephemeral: true }).catch(e => { })
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
              await button.deferUpdate().catch(e => {})
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
              .setTitle(`${name}`)
              .setThumbnail(interaction.user.displayAvatarURL({ size: 2048, dynamic: true }))
              .setColor(client.config.embedColor)
              .setDescription('Timeout Utiliser à nouveau la commande!'.replace("{name}", name))
              .setFooter({ text: 'YouTube - Skea' })
            return interaction.editReply({ embeds: [embed], components: [button] }).catch(e => { })

          })
        }).catch(e => { })

      }

      if (stp === "lists") {
        const playlist = await db?.playlist?.findOne({ userID: interaction.user.id }).catch(e => { })
        if (!playlist?.playlist?.length > 0) return interaction.reply({ content: `<a:awarning:1222570208519127124> Vous n'avez pas créé d'album`, ephemeral: true }).catch(e => { })

        let number = 1
        const embed = new EmbedBuilder()
          .setAuthor({
            name: 'Vos albums',
            iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213422313035407360/8218-alert.gif',
            url: 'https://discord.gg/ZCfbtCf5rJ'
          })
          .setColor(client.config.embedColor)
          .setDescription(`\n${playlist?.playlist?.map(data =>
            `\n**${number++} |** \`${data.name}\` - **${playlist?.musics?.filter(m => m.playlist_name === data.name)?.length || 0}** jouer (<t:${Math.floor(data.createdTime / 1000) }:R>)`
          ) }`)
          .setFooter({ text: 'YouTube - Skea' })
        return interaction.reply({ embeds: [embed] }).catch(e => { }) 

      }

      if (stp === "top") {
        let playlists = await db?.playlist?.find().catch(e => { })
        if (!playlists?.length > 0) return interaction.reply({ content: 'Il n\'y a pas de listes de lecture <:PRO_OUT:1223462369154302043>', ephemeral: true }).catch(e => { })

        let trackl = []
        playlists.map(async data => {
          data.playlist.filter(d => d.public === true).map(async d => {
            let filter = data.musics.filter(m => m.playlist_name === d.name)
            if (filter.length > 0) {
              trackl.push(d)
            }
          })
        })

        trackl = trackl.filter(a => a.plays > 0) 

        if (!trackl?.length > 0) return interaction.reply({ content: 'Il n\'y a pas de listes de lecture <:PRO_OUT:1223462369154302043>', ephemeral: true }).catch(e => { })

        trackl = trackl.sort((a, b) => b.plays - a.plays)

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
          if (!current || !current?.length > 0) return interaction.reply({ content: `Il n'y a pas d'album <:PRO_OUT:1223462369154302043>`, ephemeral: true }).catch(e => { })
          return new EmbedBuilder()
            .setAuthor({
              name: 'Top Albums',
              iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213422313035407360/8218-alert.gif',
              url: 'https://discord.gg/ZCfbtCf5rJ'
            })
            .setThumbnail(interaction.user.displayAvatarURL({ size: 2048, dynamic: true }))
            .setColor(client.config.embedColor)
            .setDescription(`\n${current.map(data =>
              `\n**${sayı++} |** \`${data.name}\` Par. \`${data.authorTag}\` - **${data.plays}** "jouer" (<t:${Math.floor(data.createdTime / 1000) }:R>)`
            ) }`)
            .setFooter({ text: `Section ${page}/${Math.floor(a+1) }` })
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
            if (button.customId === "close") {
              collector.stop()
              return button.reply({ content: `Commande arrêtée <:PRO_CHECKMARK:1222535886437224480>`, ephemeral: true }).catch(e => { })
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
              await button.deferUpdate().catch(e => {})
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
              .setAuthor({
          name: 'Meilleurs albums',
          iconURL: 'https://cdn.discordapp.com/attachments/1213421081226903552/1213422313035407360/8218-alert.gif',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
              .setThumbnail(interaction.user.displayAvatarURL({ size: 2048, dynamic: true }))
              .setColor(client.config.embedColor)
              .setDescription('TimeOut!')
              .setFooter({ text: 'YouTube - Skea' })
            return interaction.editReply({ embeds: [embed], components: [button] }).catch(e => { })

          })
        }).catch(e => { })

      }
    } catch (e) {
      console.error(e);
      interaction.reply({ content: 'Une erreur s\'est produite lors de l\'exécution de cette commande!', ephemeral: true }).catch(e => { })
    }
  }
}
