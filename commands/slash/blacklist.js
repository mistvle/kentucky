const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Manage blacklisted users.")

        // ISSUE
        .addSubcommand(subcommand =>
            subcommand
                .setName("issue")
                .setDescription("Blacklist a user.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
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
                .setDescription("View a user's blacklist history.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Select the user.")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {

        const hasRole = interaction.member.roles.cache.has("ROLE_ID_HERE");
        const isAdmin = interaction.member.permissions.has("Administrator");

        if (!isAdmin && !hasRole) {
            return interaction.reply({
                content: "<:xMark:1506513418470035467> You do not have permission to run this command.",
                flags: 64
            });
        }

        const db = interaction.client.db;
        const sub = interaction.options.getSubcommand();

        // ================= ISSUE =================
        if (sub === "issue") {

            const user = interaction.options.getUser("user");
            const reason = interaction.options.getString("reason");

            db.prepare(`
                CREATE TABLE IF NOT EXISTS blacklists (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT,
                    moderator_id TEXT,
                    reason TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `).run();

            const result = db.prepare(`
                INSERT INTO blacklists
                (user_id, moderator_id, reason)
                VALUES (?, ?, ?)
            `).run(
                user.id,
                interaction.user.id,
                reason
            );

            const id = result.lastInsertRowid;

            await interaction.reply({
                content: `<:check:1506513370625347816> **Successfully** blacklisted ${user} (**#${id}**).`,
                flags: 64
            });

            await user.send({
                content:
                    `<:dnd:1506531236871409694> You have been blacklisted.\n\n` +
                    `**Reason:** ${reason}\n` +
                    `**Blacklist ID:** ${id}`
            }).catch(() => null);
        }

        // ================= VIEW =================
        if (sub === "view") {

            const user = interaction.options.getUser("user");

            db.prepare(`
                CREATE TABLE IF NOT EXISTS blacklists (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT,
                    moderator_id TEXT,
                    reason TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `).run();

            const rows = db.prepare(`
                SELECT * FROM blacklists
                WHERE user_id = ?
                ORDER BY id DESC
            `).all(user.id);

            if (!rows.length) {
                return interaction.reply({
                    content: "<:xMark:1506513418470035467> No blacklist history found for this user.",
                    flags: 64
                });
            }

            const formatted = rows.map(r =>
                `### Blacklist #${r.id}\n- Reason: ${r.reason}\n- Moderator: <@${r.moderator_id}>`
            ).join("\n\n");

            await interaction.reply({
                flags: 64,
                content:
                    `# Blacklist History - ${user.username}\n\n${formatted}`
            });
        }
    }
};