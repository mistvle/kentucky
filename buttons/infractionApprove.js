module.exports = {
    customId: "infraction_approve",

    async execute(interaction) {

        await interaction.deferUpdate();

        const id = interaction.customId.split("_")[2];

        const db = interaction.client.db;

        const infraction = db.prepare(`
            SELECT *
            FROM infractions
            WHERE id = ?
        `).get(id);

        if (!infraction) {
            return interaction.followUp({
                content: "<:xMark:1506513418470035467> Invalid infraction.",
                flags: 64
            });
        }

        db.prepare(`
            UPDATE infractions
            SET
                approved = 1,
                approved_by = ?,
                approved_at = ?
            WHERE id = ?
        `).run(
            interaction.user.id,
            Date.now(),
            id
        );

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
**Reason:** ${infraction.reason}
**Proof:** ${infraction.proof || "N/A"}`
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
                                    url: "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png"
                                }
                            }
                        ]
                    }
                ]
            }]
        }).catch(() => {});

        const logChannel =
            interaction.guild.channels.cache.get("1226775174238568519");

        const issuedMessage = await logChannel.send({
            flags: 32768,
            components: [{
                type: 17,
                components: [
                    {
                        type: 10,
                        content:
`# <:shield:1507893287569199104> Infraction Issued - ${id}`
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
                                    url: "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png"
                                }
                            }
                        ]
                    }
                ]
            }]
        });

        db.prepare(`
            UPDATE infractions
            SET
                issued_message_id = ?,
                issued_channel_id = ?
            WHERE id = ?
        `).run(
            issuedMessage.id,
            issuedMessage.channel.id,
            id
        );

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

        if (data[0]) {
            data[0].accent_color = 5763719;
        }

        for (const component of data[0].components) {

            if (
                component.type === 1 &&
                component.components
            ) {

                component.components = [
                    {
                        type: 2,
                        style: 3,
                        label: `Approved by ${interaction.user.username}`,
                        disabled: true,
                        custom_id: `approved_${id}`
                    },
                    {
                        type: 2,
                        style: 1,
                        label: "Edit",
                        custom_id: `infraction_edit_${id}`
                    }
                ];
            }
        }

        await interaction.message.edit({
            components: data
        });

        await interaction.followUp({
            content: "<:check:1506513370625347816> Successfully accepted infraction request.",
            flags: 64
        });
    }
};