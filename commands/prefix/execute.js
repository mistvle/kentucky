const axios = require("axios");

module.exports = {
    name: "execute",

    async execute(message, args) {


        const isAdmin = message.member.permissions.has("Administrator");

        if (!isAdmin) {
            return message.reply({
                content: "<:xMark:1506513418470035467> You do not have permission to run this command.",
                allowedMentions: { repliedUser: false }
            });
        }

        const command = args.join(" ");

        if (!command) {
            return message.reply({
                content: "<:xMark:1506513418470035467> Please provide a command to execute.",
                allowedMentions: { repliedUser: false }
            });
        }

        try {

            await axios.post(
                "https://api.erlc.gg/v1/server/command",
                {
                    command: command
                },
                {
                    headers: {
                        "Server-Key": process.env.ERLC_API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            );

            await message.reply({
                content: `<:check:1506513370625347816> **Successfully** executed command: \`${command}\``,
                allowedMentions: { repliedUser: false }
            });

        } catch (err) {
            console.error(err);

            await message.reply({
                content: "<:xMark:1506513418470035467> Failed to execute ER:LC command.",
                allowedMentions: { repliedUser: false }
            });
        }
    }
};