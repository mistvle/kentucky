const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("infraction")
        .setDescription("Manage staff infractions.")

        // ISSUE
        .addSubcommand(subcommand =>
            subcommand
                .setName("request")
                .setDescription("Request approval for an infraction.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("type")
                        .setDescription("Select the infraction type.")
                        .addChoices(
                            { name: "Inactivity Notice", value: "Inactivity Notice" },
                            { name: "Warning", value: "Warning" },
                            { name: "Strike", value: "Strike" },
                            { name: "Suspension", value: "Suspension" },
                            { name: "Demotion", value: "Demotion" },
                            { name: "Termination", value: "Termination" }
                        )
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Provide a reason.")
                        .setRequired(true)
                )
        )

        // VIEW
        .addSubcommand(subcommand =>
            subcommand
                .setName("view")
                .setDescription("View infractions.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
                        .setRequired(true)
                )
        )

        // REVOKE
        .addSubcommand(subcommand =>
            subcommand
                .setName("revoke")
                .setDescription("Revoke an infraction.")
                .addIntegerOption(option =>
                    option
                        .setName("id")
                        .setDescription("Provide the infraction ID.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const REQUIRED_ROLE_ID = "1226036262092275763";

        const hasRole = interaction.member.roles.cache.has(REQUIRED_ROLE_ID);
        const isAdmin = interaction.member.permissions.has("Administrator");

        if (!hasRole && !isAdmin) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> You do not have permission to run this command.",
                flags: 64
            });
        }

        const db = interaction.client.db;

        const sub = interaction.options.getSubcommand();

        // ================= ISSUE =================
        if (sub === "request") {

            const user = interaction.options.getUser("user");
            const type = interaction.options.getString("type");
            const reason = interaction.options.getString("reason");

            const member = await interaction.guild.members
                .fetch(user.id)
                .catch(() => null);

            if (!member) {
                return interaction.reply({
                    content: "<:xMark:1506513418470035467> This user is not in the server.",
                    flags: 64
                });
            }

            const result = db.prepare(`
                INSERT INTO infractions
                (user_id, moderator_id, type, reason)
                VALUES (?, ?, ?, ?)
            `).run(
                user.id,
                interaction.user.id,
                type,
                reason
            );

            const id = result.lastInsertRowid;


            const logChannel = interaction.guild.channels.cache.get("1497627562954719383");

            await logChannel.send({
  "flags": 32768,
  "components": [
    {
      "type": 17,
      "components": [
        {
          "type": 10,
          "content": "# <:bell:1506530215223099412> Infraction Approval\n-# <@&1226052335474839602>"
        },
        {
          "type": 14,
          "spacing": 2
        },
        {
          "type": 10,
          "content": "An Infraction has been sent for approval by ${interaction.user}.\n\n<:person:1506523692920737822> **User:** ${user}\n<:pin:1506523961356320820> **Type:** ${type}\n<:clipboard:1506523825817391136> **Reason:** ${reason}"
        },
        {
          "type": 14,
          "divider": false
        },
        {
          "type": 1,
          "components": [
            {
              "style": 3,
              "type": 2,
              "label": "Approve",
              "emoji": {
                "id": "1506513370625347816",
                "name": "check",
                "animated": false
              },
              "custom_id": `infraction_approve_${id}`,
              "flow": {
                "actions": []
              }
            },
            {
              "style": 4,
              "type": 2,
              "label": "Deny",
              "emoji": {
                "id": "1506513418470035467",
                "name": "xMark",
                "animated": false
              },
              "custom_id": `infraction_deny_${id}`,
              "flow": {
                "actions": []
              }
            }
          ]
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
                "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a1ad7cf&is=6a19864f&hm=80c27d77c673cd9b9cae9e65deac84d955ec37161ca0fe040812c4fff1466b38&=&format=webp&quality=lossless"
              }
            }
          ]
        }
      ]
    }
  ]
});


            await interaction.reply({
                content: `<:check:1506513370625347816> **Successfully** requested approval for infraction **#${id}** to ${user}.`,
                flags: 64
            });
        }

        // ================= VIEW =================
        if (sub === "view") {

            const user = interaction.options.getUser("user");

            const infractions = db.prepare(`
                SELECT * FROM infractions
                WHERE user_id = ?
                ORDER BY id DESC
            `).all(user.id);

            if (!infractions.length) {
                return interaction.reply({
                    content: "<:xMark:1506513418470035467> No infractions found for this user.",
                    flags: 64
                });
            }

            const formatted = infractions.map(infraction =>
`### Infraction - ${infraction.id}
- Type: ${infraction.type}
- Reason: ${infraction.reason}`).join("\n\n");

            await interaction.reply({
                "flags": 32832,
                "components": [
                    {
                        "type": 17,
                        "components": [
                            {
                                "type": 10,
                                "content": `# <:briefcase:1506523492747579424> Infractions - ${user.username}`
                            },
                            {
                                "type": 14,
                                "spacing": 2
                            },
                            {
                                "type": 10,
                                "content": formatted
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
        }

        // ================= REVOKE =================
        if (sub === "revoke") {

            const id = interaction.options.getInteger("id");

            const data = db.prepare(`
                SELECT * FROM infractions
                WHERE id = ?
            `).get(id);

            if (!data) {
                return interaction.reply({
                    content: "<:xMark:1506513418470035467> Invalid infraction ID.",
                    flags: 64
                });
            }

            db.prepare(`
                DELETE FROM infractions
                WHERE id = ?
            `).run(id);

            await interaction.reply({
                content: `<:check:1506513370625347816> **Successfully** revoked infraction **#${id}**.`,
                flags: 64
            });
        }
    }
};