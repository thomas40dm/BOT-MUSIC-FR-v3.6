const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "playsong",
  description: "Jouer une piste.",
  permissions: "0x0000000000000800",
  options: [
    {
      name: "normal",
      description: "Ouvrir de la musique à partir d'autres plateformes.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Écrivez le nom de votre musique.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
    {
      name: "playlist",
      description: "Écrivez le nom de votre playlist.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "name",
          description: "Écrivez le nom de la playlist que vous souhaitez créer.",
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    },
  ],
  voiceChannel: true,
  run: async (client, interaction) => {


   

    try {
      let stp = interaction.options.getSubcommand()

      if (stp === "playlist") {
        let playlistw = interaction.options.getString('name')
        let playlist = await db?.playlist?.find().catch(e => { })
        if (!playlist?.length > 0) return interaction.reply({ content: `Il n'y a pas de playlist. <:PRO_OUT:1223462369154302043>`, ephemeral: true }).catch(e => { })

        let arr = 0
        for (let i = 0; i < playlist.length; i++) {
          if (playlist[i]?.playlist?.filter(p => p.name === playlistw)?.length > 0) {

            let playlist_owner_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].author
            let playlist_public_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].public

            if (playlist_owner_filter !== interaction.member.id) {
              if (playlist_public_filter === false) {
                return interaction.reply({ content: `Vous n'êtes pas autorisé à lire cette playlist. <:PRO_OUT:1223462369154302043>`, ephemeral: true }).catch(e => { })
              }
            }

            const music_filter = playlist[i]?.musics?.filter(m => m.playlist_name === playlistw)
            if (!music_filter?.length > 0) return interaction.reply({ content: `Pas de musique avec le nom`, ephemeral: true }).catch(e => { })
                const listembed = new EmbedBuilder()
                .setTitle('Chargement de votre album')
                .setColor('#2b2d31')
                .setDescription('**<a:PRO_WUMPUSDANCE:1224435514220740638> Préparez-vous pour un voyage musical !**');
            interaction.reply({ content : '', embeds: [listembed] }).catch(e => { })

            let songs = []
            music_filter.map(m => songs.push(m.music_url))

            setTimeout(async () => {
              const playl = await client?.player?.createCustomPlaylist(songs, {
                member: interaction.member,
                properties: { name: playlistw, source: "custom" },
                parallel: true
              });
              const qembed = new EmbedBuilder()
        .setAuthor({
        name: 'Chansons d\'album ajoutées à la file d\'attente',
        iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157218651179597884/1213-verified.gif', 
        url: 'https://discord.gg/ZCfbtCf5rJ'
    })
        .setColor('#2b2d31')
        .setFooter({ text: 'Utilisez /queue pour plus d\'informations' });
           
              await interaction.editReply({ content: '',embeds: [qembed] }).catch(e => {
                  console.error('Error  reply:', e);
                });

              try {
                await client.player.play(interaction.member.voice.channel, playl, {
                  member: interaction.member,
                  textChannel: interaction.channel,
                  interaction
                })
              } catch (e) {
                await interaction.editReply({ content: `<:PRO_OUT:1223462369154302043> Aucun résultat trouvé!!`, ephemeral: true }).catch(e => { })
              }

              playlist[i]?.playlist?.filter(p => p.name === playlistw).map(async p => {
                await db.playlist.updateOne({ userID: p.author }, {
                  $pull: {
                    playlist: {
                      name: playlistw
                    }
                  }
                }, { upsert: true }).catch(e => { })

                await db.playlist.updateOne({ userID: p.author }, {
                  $push: {
                    playlist: {
                      name: p.name,
                      author: p.author,
                      authorTag: p.authorTag,
                      public: p.public,
                      plays: Number(p.plays) + 1,
                      createdTime: p.createdTime
                    }
                  }
                }, { upsert: true }).catch(e => { })
              })
            }, 3000)
          } else {
            arr++
            if (arr === playlist.length) {
              return interaction.reply({ content: `Il n'y a pas d'album <:PRO_OUT:1223462369154302043>`, ephemeral: true }).catch(e => { })
            }
          }
        }
      }

      if (stp === "normal") {
  const name = interaction.options.getString('name');
  if (!name) {
    return interaction.reply({ content: '<:PRO_RIGHT:1221477527449632779> Donner du texte ou un lien', ephemeral: true }).catch(e => {});
  }

  const embed = new EmbedBuilder()
    .setColor('#2b2d31')
    .setDescription('**<a:PRO_WUMPUSDANCE:1224435514220740638> Préparez-vous pour un voyage musical!**');

  await interaction.reply({ embeds: [embed] }).catch(e => {});

  try {
    await client.player.play(interaction.member.voice.channel, name, {
      member: interaction.member,
      textChannel: interaction.channel,
      interaction
    });
  } catch (e) {
    const errorEmbed = new EmbedBuilder()
      .setColor('#2b2d31')
      .setDescription('<:PRO_OUT:1223462369154302043> Aucun résultat trouvé!!');

    await interaction.editReply({ embeds: [errorEmbed], ephemeral: true }).catch(e => {});
  }
}

    }  catch (e) {
    console.error(e); 
  }
  },
};
