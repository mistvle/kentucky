module.exports = {
    customId: "infraction_approve",

    async execute(interaction) {

        const id = interaction.customId.split("_")[2];

        const db = interaction.client.db;

        const infraction = db.prepare(`
            SELECT *
            FROM infractions
            WHERE id = ?
        `).get(id);

        if (!infraction) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> Invalid infraction.",
                flags: 64
            });
        }

        const targetUser = await interaction.client.users
            .fetch(infraction.user_id)
            .catch(() => null);

        const requester = await interaction.client.users
            .fetch(infraction.moderator_id)
            .catch(() => null);

        await targetUser?.send({
            flags: 32768,
            components: [{
                type: 17,
                components: [
                    {
                        type: 10,
                        content: `# <:shield:1507893287569199104> Infraction Issued - ${id}`
                    },
                    {
                        type: 14,
                        spacing: 2
                    },
                    {
                        type: 10,
                        content:
`An infraction has been issued to you. View information regarding it below.

**User:** <@${infraction.user_id}>
**Type:** ${infraction.type}
**Reason:** ${infraction.reason}`
                    },
                    {
                        type: 14,
                        spacing: 2
                    },
                    {
                        type: 12,
                        items: [
                            {
                                media: {
                                    url: "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a1b808f&is=6a1a2f0f&hm=ac4b5d0095d395f14cb6b79008cd715cf605b7df7af5feb2f5dca0271c7013db&=&format=webp&quality=lossless"
                                }
                            }
                        ]
                    }
                ]
            }]
        }).catch(() => {});

        const logChannel =
            interaction.guild.channels.cache.get("1226775174238568519");

        await logChannel.send({
            flags: 32768,
            components: [{
                type: 17,
                components: [
                    {
                        type: 10,
                        content: `# <:shield:1507893287569199104> Infraction Issued - ${id}`
                    },
                    {
                        type: 14,
                        spacing: 2
                    },
                    {
                        type: 10,
                        content:
`An infraction has been issued by <@${infraction.moderator_id}>. View information regarding it below.

**User:** <@${infraction.user_id}>
**Type:** ${infraction.type}
**Reason:** ${infraction.reason}`
                    },
                    {
                        type: 14,
                        spacing: 2
                    },
                    {
                        type: 12,
                        items: [
                            {
                                media: {
                                    url: "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a1b808f&is=6a1a2f0f&hm=ac4b5d0095d395f14cb6b79008cd715cf605b7df7af5feb2f5dca0271c7013db&=&format=webp&quality=lossless"
                                }
                            }
                        ]
                    }
                ]
            }]
        });

        await requester?.send({
            flags: 32768,
            components: [{
                type: 17,
                components: [{
                    type: 10,
                    content: `> <:check:1506513370625347816> Infraction **#${id}** was accepted by the Directive Team.`
                }]
            }]
        }).catch(() => {});

        const data = JSON.parse(JSON.stringify(interaction.message.components));

        for (const row of data) {
            if (row.components) {
                for (const component of row.components) {
                    if (component.type === 2) {
                        component.disabled = true;
                    }
                }
            }
        }

        if (data[0]) {
            data[0].accent_color = 5763719; // Discord Green
        }

        await interaction.update({
            components: data
        });

        await interaction.followUp({
            content: "<:check:1506513370625347816> **Successfully** accepted infraction request.",
            flags: 64
        });
    }
};