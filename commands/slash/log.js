const { SlashCommandBuilder, AutoModerationRuleEventType} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
    .setName("log")
    .setDescription('log stuff')
    .addSubcommand(subcommand => subcommand
        .setName("ridealong")
        .setDescription("Log a ride along.")
        .addUserOption(option => option
            .setName('user')
            .setDescription("Select the trial moderator.")
            .setRequired(true)

        )

        .addStringOption(option => option
            .setName("result")
            .setDescription("Select the result of the ride along.")
            .addChoices(
                {name: "Passed", value: "Passed"},
                {name: "Failed", value: "Failed"}

            )
            .setRequired(true)

        )
        .addStringOption(option => option
            .setName("feedback")
            .setDescription("Input feedback for the trial moderator.")
            .setRequired(true)
        )

    ),

    async execute (interaction) {
        const REQUIRED_ROLE_IDS = [
    "1274574138656292905",
    "1226036262092275763"
];

const hasRoles = REQUIRED_ROLE_IDS.some(roleId =>
    message.member.roles.cache.has(roleId)

);

    const isAdmin = interaction.member.permissions.has("Administrator");
    if (!hasRoles && !isAdmin) {
        return interaction.reply({content: "<:xMark:1506513418470035467> You do not have permission to run this command.", flags: 64})
    }

    const user = interaction.options.getUser("user");
    const result = interaction.options.getString("rating");
    const feedback = interaction.options.getString("feedback");
    const channel = interaction.guild.channels.cache.get("1226787230891245618");
    await channel.send({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": "# <:briefcase:1506523492747579424> Ridealong Loggd"
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": `<:person:1506523692920737822> **User:** ${user}\n<:pin:1506523961356320820> **Result:** ${result}\n<:clipboard:1506523825817391136> **Feedback:** ${feedback}`
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
                "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a12eecf&is=6a119d4f&hm=a9ec55994346800496d8b9dc8bdfd398afe93f8cc1bf25bdc0d50dc6d675ef95&=&format=webp&quality=lossless&width=2116&height=108"
              }
            }
          ]
        }
      ]
    }
  ]
})
    }
}