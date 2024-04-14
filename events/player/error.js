module.exports = async (client, textChannel, e) => {
if (textChannel){
   return textChannel?.send(`**Une erreur rencontrée :** ${e.toString().slice(0, 1974)}`)
}
}

