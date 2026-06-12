module.exports = {
    customId: "infraction_edit_modal",

    async execute(interaction) {
        const db = interaction.client.db;
        const id = interaction.customId.replace("infraction_edit_modal_", "");

        const infraction = db.prepare(`
            SELECT *
            FROM infractions
            WHERE id = ?
        `).get(id);

        if (!infraction) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> Invalid infraction ID.",
                flags: 64
            });
        }

        const punishment = interaction.fields.getTextInputValue("punishment") || infraction.punishment || "";
        const type = interaction.fields.getTextInputValue("type") || infraction.type;
        const reason = interaction.fields.getTextInputValue("reason") || infraction.reason;

        db.prepare(`
            UPDATE infractions
            SET punishment = ?, type = ?, reason = ?
            WHERE id = ?
        `).run(punishment, type, reason, id);

        const user = await interaction.client.users.fetch(infraction.user_id).catch(() => null);
        const moderator = await interaction.client.users.fetch(infraction.moderator_id).catch(() => null);

        const content = `An Infraction has been edited by ${interaction.user}.

<:person:1506523692920737822> **User:** ${user || `<@${infraction.user_id}>`}
<:pin:1506523961356320820> **Type:** ${type}
<:clipboard:1506523825817391136> **Reason:** ${reason}`;

        const components = [
            {
                type: 17,
                components: [
                    {
                        type: 10,
                        content: "# <:bell:1506530215223099412> Infraction Approval"
                    },
                    {
                        type: 14,
                        spacing: 2
                    },
                    {
                        type: 10,
                        content
                    }
                ]
            }
        ];

        if (infraction.approval_channel_id && infraction.approval_message_id) {
            const channel = await interaction.guild.channels.fetch(infraction.approval_channel_id).catch(() => null);
            const message = await channel?.messages.fetch(infraction.approval_message_id).catch(() => null);

            await message?.edit({
                flags: 32768,
                components
            }).catch(() => {});
        }

        if (infraction.issued_channel_id && infraction.issued_message_id) {
            const channel = await interaction.guild.channels.fetch(infraction.issued_channel_id).catch(() => null);
            const message = await channel?.messages.fetch(infraction.issued_message_id).catch(() => null);

            await message?.edit({
                flags: 32768,
                components
            }).catch(() => {});
        }

        await user?.send({
            content: `<:bell:1506530215223099412> Infraction **#${id}** has been updated.`
        }).catch(() => {});

        return interaction.reply({
            content: `<:check:1506513370625347816> Successfully edited infraction **#${id}**.`,
            flags: 64
        });
    }
};