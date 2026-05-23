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
    await channel.send()
    }
}