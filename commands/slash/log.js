const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("log")
        .setDescription("log stuff")
        .addSubcommand(subcommand =>
            subcommand
                .setName("ridealong")
                .setDescription("Log a ride along.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Select the trial moderator.")
                        .setRequired(true)
                )

                .addStringOption(option =>
                    option
                        .setName("result")
                        .setDescription("Select the result of the ride along.")
                        .addChoices(
                            { name: "Passed", value: "Passed" },
                            { name: "Failed", value: "Failed" }
                        )
                        .setRequired(true)
                )

                .addStringOption(option =>
                    option
                        .setName("feedback")
                        .setDescription("Input feedback for the trial moderator.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const REQUIRED_ROLE_IDS = [
            "1274574138656292905",
            "1226036262092275763"
        ];

        const hasRoles = REQUIRED_ROLE_IDS.some(roleId =>
            interaction.member.roles.cache.has(roleId)
        );

        const isAdmin = interaction.member.permissions.has("Administrator");

        if (!hasRoles && !isAdmin) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> You do not have permission to run this command.",
                flags: 64
            });
        }

        const user = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> User not found.",
                flags: 64
            });
        }

        const TRIAL_ROLE_IDS = [
            "1346266516781404201",
            "1226007098832326717",
            "1226553268948435086",
            "1226757206163193856",
            "1268079347567431741",
            "1478545277161050325",
            "1229917052131868773"
        ];

        const isTrialModerator = TRIAL_ROLE_IDS.some(roleId =>
            member.roles.cache.has(roleId)
        );

        if (!isTrialModerator) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> The user provided is not a trial moderator.",
                flags: 64
            });
        }

        const result = interaction.options.getString("result");
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
                            "content": "# <:briefcase:1506523492747579424> Ridealong Logged"
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
        });

        if (result === "Passed") {

            await member.roles.add([
                "1226029621687095296",
                "1274573950751342592",
                "1226553268948435086",
                "1226480378521452594",
                "1266457792412254298",
                "1229917052131868773"
            ]).catch(() => null);

            await member.roles.remove([
                "1346266516781404201",
                "1226007098832326717",
                "1226553268948435086",
                "1226757206163193856",
                "1268079347567431741",
                "1478545277161050325",
                "1229917052131868773"
            ]).catch(() => null);

            await user.send(
                "<:bell:1506530215223099412> **Congratulations**, you have passed your R/A & have been promoted to **Junior Moderator.**"
            ).catch(() => null);
        }

        if (result === "Failed") {

            await member.roles.remove([
                "1346266516781404201",
                "1226007098832326717",
                "1226553268948435086",
                "1226757206163193856",
                "1268079347567431741",
                "1478545277161050325",
                "1229917052131868773"
            ]).catch(() => null);

            await user.send(
                "<:bell:1506530215223099412> Unfortunately, you have failed your R/A."
            ).catch(() => null);
        }

        await interaction.reply({
            content: "<:check:1506513370625347816> **Successfully** logged ride along.",
            flags: 64
        });
    }
};