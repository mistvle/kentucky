const {SlashCommandBuilder} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("evaluation")
    .setDescription("evaluation stuff")
    .addSubcommand(subcommand => subcommand
        .setName("issue")
        .setDescription("Issue a staff evaluation")
        .addUserOption(option => option
            .setName("user")
            .setDescription("Select the user to evaluate.")
            .setRequired(true)

        )
        .addStringOption(option => option
            .setName("rating")
            .setDescription("Select the rating of the evaluation (1-10).")
            .setRequired(true)

        )
        .addStringOption(option => option
            .setName("feedback")
            .setDescription('Input feedback for the moderator.')
            .setRequired(true)
        )
    ),

    async execute (interaction) {
        const hasRole = interaction.member.roles.cache.has("1226036262092275763");
        const isAdmin = interaction.member.permissions.has("Administrator");
        if (!hasRole && !isAdmin) {
            return interaction.reply({content: "<:xMark:1506513418470035467> You do not have permission to run this command.", flags: 64})

        }
        const user = interaction.options.getUser("user");
        const rating = interaction.options.getString("rating");
        const feedback = interaction.options.getString("feedback");
        const channel = interaction.guild.channels.cache.get("1226775346037260338");
        await user.send({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": "# <:briefcase:1506523492747579424> Evaluation Issued"
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": `An evaluation has been issued to you. Review information regarding it below.\n\n<:pin:1506523961356320820> **Rating:** ${rating}\n<:clipboard:1506523825817391136> **Feedback:** ${feedback}`
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
                "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a0e518f&is=6a0d000f&hm=a2a75bcf72fc62036630253a4235995c589fcba65d379da2e3e59e53c18f64e6&=&format=webp&quality=lossless"
              }
            }
          ]
        }
      ]
    }
  ]
})
        await channel.send({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": "# <:briefcase:1506523492747579424> Evaluation Issued"
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": `An evaluation has been issued by ${interaction.user}. Review information regarding it below.\n\n<:person:1506523692920737822>**User:** ${user}\n<:pin:1506523961356320820> **Rating:** ${rating}\n<:clipboard:1506523825817391136> **Feedback:** ${feedback}`
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
                "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a0e518f&is=6a0d000f&hm=a2a75bcf72fc62036630253a4235995c589fcba65d379da2e3e59e53c18f64e6&=&format=webp&quality=lossless"
              }
            }
          ]
        }
      ]
    }
  ]
});
    await interaction.reply({content: "<:check:1506513370625347816> **Successfully** issued evaluation.", flags: 64})
    }
}