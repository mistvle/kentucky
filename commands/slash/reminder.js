const {SlashCommandBuilder} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('reminder stuff')
    .addSubcommand(subcommand => subcommand
        .setName('send')
        .setDescription('Send a reminder for staff to conduct discord checks.')

    ),

    async execute(interaction) {
    const hasRole = interaction.member.roles.cache.has("1226036262092275763");
    const isAdmin = interaction.member.permissions.has("Administrator");

    if (!hasRole && !isAdmin) {
        return interaction.reply({
            content: "<:xMark:1506513418470035467> You do not have permission to run this command.",
            flags: 64
        });
    }

    const channel = interaction.guild.channels.cache.get("1392335234569207858");

    // TURN OFF
    if (interaction.client.reminderInterval) {

        clearInterval(interaction.client.reminderInterval);
        interaction.client.reminderInterval = null;

        return interaction.reply({
            content: "<:check:1506513370625347816> **Successfully** disabled automatic reminders.",
            flags: 64
        });
    }

    // SEND ONE IMMEDIATELY
    await channel.send({
        flags: 32768,
        components: [
            {
                type: 10,
                content: "<:bell:1506530215223099412> <@&1229653813686960129> Ensure to conduct Discord checks to avoid receiving a negative evaluation or an infraction."
            }
        ]
    });

    // START LOOP
    interaction.client.reminderInterval = setInterval(async () => {

        await channel.send({
            flags: 32768,
            components: [
                {
                    type: 10,
                    content: "<:bell:1506530215223099412> <@&1229653813686960129> Ensure to conduct Discord checks to avoid receiving a negative evaluation or an infraction."
                }
            ]
        }).catch(() => {});

    }, 20 * 60 * 1000); // 20 mins

    return interaction.reply({
        content: "<:check:1506513370625347816> **Successfully** enabled automatic reminders every 20 minutes.",
        flags: 64
    });
}
}