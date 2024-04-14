const db = require("../mongoDB");
module.exports = {
  name: "previous",
  description: "Lit la piste précédente.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    try {
      const queue = client.player.getQueue(interaction.guild.id);
      if (!queue || !queue.playing) return interaction.reply({ content: `<a:awarning:1222570208519127124> Aucune musique ne joue!!`, ephemeral: true }).catch(e => { })
      try {
        let song = await queue.previous()
        interaction.reply({ content: `**Voici la mélodie enchanteresse du passé!!**` }).catch(e => { })
      } catch (e) {
        return interaction.reply({ content: `<:PRO_OUT:1223462369154302043> Aucune piste précédente !!`, ephemeral: true }).catch(e => { })
      }
    } catch (e) {
    console.error(e); 
  }
  },
};
