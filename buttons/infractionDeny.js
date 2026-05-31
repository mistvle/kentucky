module.exports = {
    customId: "infraction_deny",

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

        db.prepare(`
            DELETE FROM infractions
            WHERE id = ?
        `).run(id);

        const requester = await interaction.client.users
            .fetch(infraction.moderator_id)
            .catch(() => null);

        await requester?.send({
            flags: 32768,
            components: [{
                type: 17,
                components: [{
                    type: 10,
                    content: `> <:check:1506513370625347816> Infraction **#${id}** was denied by the Directive Team.`
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
            data[0].accent_color = 15548997; // Discord Red
        }

        await interaction.update({
            components: data
        });

        await interaction.followUp({
            content: "<:check:1506513370625347816> **Successfully** denied infraction request.",
            flags: 64
        });
    }
};