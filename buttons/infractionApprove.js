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

        await interaction.update({
            components: [{
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 3,
                        label: "Approve",
                        disabled: true,
                        custom_id: "disabled"
                    },
                    {
                        type: 2,
                        style: 4,
                        label: "Deny",
                        disabled: true,
                        custom_id: "disabled"
                    }
                ]
            }]
        });
        await interaction.reply({content: "<:check:1506513370625347816> **Successfully** accepted infraction request."})
    }
};