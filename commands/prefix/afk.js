const ms = require("ms");

module.exports = {
    name: "afk",

    async execute(message, args) {

        const timeInput = args[0];
        if (!timeInput) {
            return message.reply("<:xMark:1506513418470035467> Please provide a valid duration (.e.g 5m).");
        }

        const duration = ms(timeInput);

        if (!duration) {
            return message.reply("<:xMark:1506513418470035467> Please provied a valid duration (e.g. 5m).");
        }

        const reason = args.slice(1).join(" ") || "<:xMark:1506513418470035467> Please provide a reason for your AFK.";

        // create collection if missing
        if (!message.client.afk) {
            message.client.afk = new Map();
        }

        message.client.afk.set(message.author.id, {
            reason,
            since: Date.now(),
            expires: Date.now() + duration
        });

        message.reply(`<:check:1506513370625347816> You've been marked as AFK for ${timeInput} - ${reason}.`);

        setTimeout(() => {
            if (message.client.afk.has(message.author.id)) {
                message.client.afk.delete(message.author.id);
            }
        }, duration);
    }
};