const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    customId: "infraction_edit",

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

        if (!infraction.approved) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> You may only edit approved infractions.",
                flags: 64
            });
        }

        const modal = new ModalBuilder()
            .setCustomId(`infraction_edit_modal_${id}`)
            .setTitle(`Edit Infraction #${id}`);

        const typeInput = new TextInputBuilder()
            .setCustomId("type")
            .setLabel("Type")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(infraction.type);

        const reasonInput = new TextInputBuilder()
            .setCustomId("reason")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setValue(infraction.reason);

        const proofInput = new TextInputBuilder()
            .setCustomId("proof")
            .setLabel("Proof")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setValue(infraction.proof || "N/A");

        modal.addComponents(
            new ActionRowBuilder().addComponents(typeInput),
            new ActionRowBuilder().addComponents(reasonInput),
            new ActionRowBuilder().addComponents(proofInput)
        );

        await interaction.showModal(modal);
    }
};