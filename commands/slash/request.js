const {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName("request")
    .setDescription("i guess bro")
    .addSubcommand(subcommand => subcommand
        .setName("ridealong")
        .setDescription("Request a ridealong.")
    ),
    async execute (interaction) {
        const hasRole = interaction.member.roles.cache.has("1268079347567431741");
        const isAdmin = interaction.member.permissions.has("Administrator");
        if (!hasRole && !isAdmin) {
            return interaction.reply({content: "<:fsco_xMark:1506499171509866516> You do not have permission to run this command."})

        }

        const channel = interaction.guild.channels.cache.get("1226373526957854730");
        await channel.send({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": "# <:bell:1506530215223099412> Ride Along Request\n-# <@&1274574138656292905>"
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": `A ride along request has been submitted by ${interaction.user}. Review information below & ensure to complete it if you are available.`
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 12,
          "items": [
            {
              "media": {
                "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a0fa30f&is=6a0e518f&hm=62f1834136f62eebe59cd636825c8d64d41c041ecf450aa8ce12051ffdd0d1c6&=&format=webp&quality=lossless"
              }
            }
          ]
        }
      ]
    }
  ]
});

    await interaction.reply({content: "<:check:1506513370625347816> **Successfully** requested ride along.", flags: 64})
    }
}