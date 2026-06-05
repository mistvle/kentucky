module.exports = {
    customId: "infraction_edit_modal",

    async execute(interaction) {

        const id = interaction.customId.split("_")[3];

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

        const type = interaction.fields.getTextInputValue("type");
        const reason = interaction.fields.getTextInputValue("reason");
        const proof = interaction.fields.getTextInputValue("proof");

        const changed = [];

        if (type !== infraction.type) changed.push("type");
        if (reason !== infraction.reason) changed.push("reason");
        if (proof !== (infraction.proof || "")) changed.push("proof");

        db.prepare(`
            UPDATE infractions
            SET
                type = ?,
                reason = ?,
                proof = ?,
                last_edited_by = ?,
                last_edited_at = ?,
                last_edited_field = ?
            WHERE id = ?
        `).run(
            type,
            reason,
            proof,
            interaction.user.id,
            Date.now(),
            changed.join("/"),
            id
        );

        const updated = db.prepare(`
            SELECT *
            FROM infractions
            WHERE id = ?
        `).get(id);

        const targetUser = await interaction.client.users
            .fetch(updated.user_id)
            .catch(() => null);

        if (targetUser) {

            if (type !== infraction.type) {
                await targetUser.send(
                    `Infraction #${id}'s type has been updated to: **${type}**`
                ).catch(() => {});
            }

            if (reason !== infraction.reason) {
                await targetUser.send(
                    `Infraction #${id}'s reason has been updated to: **${reason}**`
                ).catch(() => {});
            }

            if (proof !== (infraction.proof || "")) {
                await targetUser.send(
                    `Infraction #${id}'s proof has been updated.`
                ).catch(() => {});
            }
        }

        const editLine =
            updated.last_edited_by
                ? `\n-# Last edited ${updated.last_edited_field} by <@${updated.last_edited_by}> <t:${Math.floor(updated.last_edited_at / 1000)}:f>`
                : "";

        const voidLine =
            updated.voided
                ? "\n-# Infraction Voided"
                : "";

        const approvalChannel =
            await interaction.client.channels
                .fetch(updated.approval_channel_id)
                .catch(() => null);

        if (approvalChannel) {

            const approvalMessage =
                await approvalChannel.messages
                    .fetch(updated.approval_message_id)
                    .catch(() => null);

            if (approvalMessage) {

                const data =
                    JSON.parse(JSON.stringify(approvalMessage.components));

                data[0].components[0].content =
`# <:bell:1506530215223099412> Infraction Approval
-# Approved by <@${updated.approved_by}>${voidLine}${editLine}`;

                await approvalMessage.edit({
                    components: data
                }).catch(() => {});
            }
        }

        const issuedChannel =
            await interaction.client.channels
                .fetch(updated.issued_channel_id)
                .catch(() => null);

        if (issuedChannel) {

            const issuedMessage =
                await issuedChannel.messages
                    .fetch(updated.issued_message_id)
                    .catch(() => null);

            if (issuedMessage) {

                const data =
                    JSON.parse(JSON.stringify(issuedMessage.components));

                data[0].components[0].content =
`# <:shield:1507893287569199104> Infraction Issued - ${id}
-# Approved by <@${updated.approved_by}>${voidLine}${editLine}`;

                await issuedMessage.edit({
                    components: data
                }).catch(() => {});
            }
        }

        await interaction.reply({
            content: "<:check:1506513370625347816> Successfully updated infraction.",
            flags: 64
        });
    }
};