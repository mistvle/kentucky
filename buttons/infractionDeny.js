module.exports = {
    customId: "infraction_deny",

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
                    content: `> <:xMark:1506513418470035467> Infraction **#${id}** was denied by the Directive Team.`
                }]
            }]
        }).catch(() => {});

        const data = JSON.parse(JSON.stringify(interaction.message.components));

        if (data[0]) {
            data[0].accent_color = 15548997;
        }

        for (const component of data[0].components) {

            if (
                component.type === 1 &&
                component.components
            ) {

                component.components = [
                    {
                        type: 2,
                        style: 4,
                        label: `Denied by ${interaction.user.username}`,
                        disabled: true,
                        custom_id: `denied_${id}`
                    }
                ];
            }
        }

        await interaction.message.edit({
            components: data
        });

        await interaction.followUp({
            content: "<:check:1506513370625347816> Successfully denied infraction request.",
            flags: 64
        });
    }
};