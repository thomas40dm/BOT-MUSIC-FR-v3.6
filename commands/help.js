
const { ApplicationCommandOptionType } = require('discord.js');
const db = require("../mongoDB");

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { ButtonStyle } = require('discord.js');

module.exports = {
  name: "help",
  description: "Obtenir des informations sur le bot et les commandes.",
  permissions: "0x0000000000000800",
  options: [],

  run: async (client, interaction) => {
    try {
      const musicCommandsEmbed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle('<a:PRO_WUMPUSDANCE:1224435514220740638> **Commandes musicales**')
        .addFields(
          { name: '🎹 </play:1226203468176293919>', value: 'Diffusez une chanson à partir d\'un lien donné ou d\'un texte à partir de sources' },
          { name: '⏹️ </stop:1226203468382081132>', value: 'Fait en sorte que le bot arrête de jouer de la musique et laisse la voix' },
          { name: '📊 </queue:1226203468382081127>', value: 'Afficher et gérer la file d\'attente des chansons de ce serveur' },
          { name: '⏭️ </skip:1226203468382081131>', value: 'Passer la chanson en cours de lecture' },
          { name: '⏸️ </pause:1226203468176293917>', value: 'Mettre en pause la chanson en cours de lecture' },
          { name: '▶️ </resume:1226203468382081128>', value: 'Reprendre la chanson en pause en cours' },
          { name: '🔁 </loop:1226203468176293914>', value: 'Basculer le mode boucle pour la file d\'attente et la chanson en cours' },
          { name: '🔄 </autoplay:1226203468176293910>', value: 'Activer ou désactiver la lecture automatique [lire des chansons aléatoires]' },
          { name: '⏩ </seek:1226203468382081129>', value: 'Rechercher un moment précis dans la chanson en cours' },
          { name: '⏮️ </previous:1226203468382081126>', value: 'Jouer la chanson précédente dans la file d\'attente' },
          { name: '🔀 </shuffle:1226203468382081130>', value: 'Mélangez les chansons en file d\'attente' },
          { name: '📃 </playlist create:1226203468382081124>', value: 'Gérer les playlists' }
        )
        .setImage(`https://cdn.discordapp.com/attachments/1004341381784944703/1165201249331855380/RainbowLine.gif?ex=654f37ba&is=653cc2ba&hm=648a2e070fab36155f4171962e9c3bcef94857aca3987a181634837231500177&`); 

      const basicCommandsEmbed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle('<a:PRO_ETOILES:1226242026345992252> **Commandes de base**')
        .addFields(
          { name: '🏓 </ping:1226203468176293918>', value: "Vérifiez la latence du bot" },
          { name: '🗑️ </clear:1226203468176293911>', value: 'Effacer la file d\'attente des chansons de ce serveur' },
          { name: '⏱️ </time:1226203468382081133>', value: 'Afficher la durée de lecture actuelle de la chanson' },
          { name: '🎧 </filter:1226203468176293912>', value: 'Appliquez des filtres pour améliorer le son comme vous l\'aimez' },
           { name: '🎵 </nowplaying:1226203468176293915>', value: 'Afficher les informations sur la chanson en cours de lecture' },
          { name: '🔊 </volume:1226203468583272570>', value: 'Ajustez le volume de la musique [entendre à des volumes élevés est risqué]' },
        ) 
       .setImage('https://zupimages.net/up/24/12/0w4k.gif')
      const button1 = new ButtonBuilder()
        .setLabel('YouTube')
        .setURL('https://www.youtube.com/channel/UCw2Zg8YmElcmk6-udhlQh4w')
        .setStyle(ButtonStyle.Link);

      const button2 = new ButtonBuilder()
        .setLabel('Discord')
        .setURL('https://discord.gg/ZCfbtCf5rJ')
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder()
        .addComponents(button1, button2);

      interaction.reply({
        embeds: [musicCommandsEmbed, basicCommandsEmbed],
        components: [row]
      }).catch(e => {});
    } catch (e) {
      console.error(e);
    }
  },
};
