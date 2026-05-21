const { SlashCommandBuilder } = require("discord.js");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Manage blacklists.")

        // ISSUE
        .addSubcommand(subcommand =>
            subcommand
                .setName("issue")
                .setDescription("Issue a blacklist.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("duration")
                        .setDescription("Provide a duration.")
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
                .setDescription("View a user's blacklist.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const REQUIRED_ROLE_ID = "1226036262092275763";

        const hasRole = interaction.member.roles.cache.has(REQUIRED_ROLE_ID);
        const isAdmin = interaction.member.permissions.has("Administrator");

        if (!isAdmin && !hasRole) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> You do not have permission to run this command.",
                flags: 64
            });
        }

        const db = interaction.client.db;

        db.prepare(`
            CREATE TABLE IF NOT EXISTS blacklists (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                moderator_id TEXT,
                duration TEXT,
                reason TEXT,
                created_at INTEGER
            )
        `).run();

        const sub = interaction.options.getSubcommand();

        // ================= ISSUE =================
        if (sub === "issue") {

            const user = interaction.options.getUser("user");
            const duration = interaction.options.getString("duration");
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
    await member.roles.add("1226378620264648734");
    await member.send({
  "flags": 32768,
  "components": [
    {
      "type": 10,
      "content": "<:bell:1506530215223099412> You have been **staff blacklisted** from **Kentucky State Roleplay**."
    }
  ]
})

            if (!ms(duration)) {
                return interaction.reply({
                    content: "<:xMark:1506513418470035467> Please provide a valid duration.",
                    flags: 64
                });
            }

            db.prepare(`
                INSERT INTO blacklists
                (user_id, moderator_id, duration, reason, created_at)
                VALUES (?, ?, ?, ?, ?)
            `).run(
                user.id,
                interaction.user.id,
                duration,
                reason,
                Date.now()
            );

            const logChannel = interaction.guild.channels.cache.get("1360197143628877884");

            await logChannel.send({
                "flags": 32768,
                "components": [
                    {
                        "type": 17,
                        "components": [
                            {
                                "type": 10,
                                "content": "# <:briefcase:1506523492747579424> Blacklist Issued"
                            },
                            {
                                "type": 14,
                                "spacing": 2
                            },
                            {
                                "type": 10,
                                "content": `A blacklisted has been issued by ${interaction.user}. View information regarding it below.\n\n<:person:1506523692920737822> **User:** ${user}\n<:pin:1506523961356320820> **Duration:** ${duration}\n<:clipboard:1506523825817391136> **Reason:** ${reason}`
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
                                            "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a0fa30f&is=6a0e518f&hm=62f1834136f62eebe59cd636825c8d64d41c041ecf450aa8ce12051ffdd0d1c6&=&format=webp&quality=lossless"
                                        }
                                    }
                                ]
                            }
                        ],
                        "spoiler": true
                    }
                ]
            });

            await interaction.reply({
                content: `<:check:1506513370625347816> **Successfully** issued blacklist to ${user}.`,
                flags: 64
            });
        }

        // ================= VIEW =================
        if (sub === "view") {

            const user = interaction.options.getUser("user");

            const data = db.prepare(`
                SELECT * FROM blacklists
                WHERE user_id = ?
                ORDER BY id DESC
                LIMIT 1
            `).get(user.id);

            if (!data) {
                return interaction.reply({
                    content: "<:xMark:1506513418470035467> No blacklist found for this user.",
                    flags: 64
                });
            }

            await interaction.reply({
                "flags": 32832,
                "components": [
                    {
                        "type": 17,
                        "components": [
                            {
                                "type": 10,
                                "content": `# <:clipboard:1506523825817391136> Blacklist - ${user.username}`
                            },
                            {
                                "type": 14,
                                "spacing": 2
                            },
                            {
                                "type": 10,
                                "content": `**Duration:** ${data.duration}\n**Reason:** ${data.reason}\n**Issued By:** <@${data.moderator_id}>\n**Issued:** <t:${Math.floor(data.created_at / 1000)}:F>`
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
                                            "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a0fa30f&is=6a0e518f&hm=62f1834136f62eebe59cd636825c8d64d41c041ecf450aa8ce12051ffdd0d1c6&=&format=webp&quality=lossless"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        }
    }
};