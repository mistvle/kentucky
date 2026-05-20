const {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('reminder stuff')
    .addSubcommand(subcommand => subcommand
        .setName('send')
        .setDescription('Send a reminder for staff to conduct discord checks.')

    ),

    async execute (interaction) {
        const hasRole = interaction.member.roles.cache.has("1226036262092275763");
        const isAdmin = interaction.member.permissions.has("Administrator");
        if (!hasRole && !isAdmin) {
            return interaction.reply({content: ""})
        }

        const channel = interaction.guild.channels.cache.get("1392335234569207858");
        await channel.send({
  "flags": 32768,
  "components": [
    {
      "type": 10,
      "content": "<:bell:1506530215223099412> @curently moderating Ensure to conduct Discord checks to avoid receiving a negative review or an infraction."
    }
  ]
});

    await interaction.reply({content: "<:check:1506513370625347816> **Successfully** sent reminder.", flags: 64})
    }
}