
const { ApplicationCommandOptionType } = require('discord.js');
const db = require("../mongoDB");

module.exports = {
  name: "owner",
  description: "Obtenir des informations sur le propriétaire du bot.",
  permissions: "0x0000000000000800",
  options: [],

  run: async (client, interaction) => {
    try {
      const youtubeLink = 'https://discord.gg/ZCfbtCf5rJ';
      const InstagramLink = 'https://www.instagram.com/thomas_dm40/';
      const { EmbedBuilder } = require('discord.js')
        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setAuthor({
          name: 'Owner',
          iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157310253520662638/2443-iconperson.png?ex=651824aa&is=6516d32a&hm=0becc4a0fda01e5a02a63cf098db30c287e60a474f8d2da4ddeae7f47d98a5a3&',
          url: 'https://discord.gg/ZCfbtCf5rJ'
        })
            .setDescription(`__**Sur moi**__:\n\n Moi-même Thomas alias Skea. Je suis développeur de robots Discord et développeur Web. J'aime jouer à des jeux, regarder des anime et créer différentes applications de serveur Web. Vous obtiendrez des réponses plus rapides sur Instagram que sur les autres réseaux sociaux. N'hésitez pas à me contacter!\n YouTube : ❤️ [Skea](${youtubeLink})\n Instagram : 💙 [ThomasDM](${InstagramLink})`)
            .setTimestamp();
      interaction.reply({ embeds: [embed] }).catch(e => {});

    } catch (e) {
    console.error(e); 
  }
  },
};
