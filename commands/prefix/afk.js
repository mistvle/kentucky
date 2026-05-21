const ms = require("ms");

module.exports = {
    name: "afk",

    async execute(message, args) {

        // create collection if missing
        if (!message.client.afk) {
            message.client.afk = new Map();
        }

        // ================= END AFK =================
        if (args[0]?.toLowerCase() === "end") {

            if (!message.client.afk.has(message.author.id)) {
                return message.reply("<:xMark:1506513418470035467> You are not currently AFK.");
            }

            message.client.afk.delete(message.author.id);

            await message.author.send(
                "<:bell:1506530215223099412> Welcome back, your AFK status has been removed."
            ).catch(() => {});

            return message.reply(
                "<:check:1506513370625347816> Welcome back, your AFK has been removed."
            );
        }

        // ================= SET AFK =================
        const timeInput = args[0];

        if (!timeInput) {
            return message.reply("<:xMark:1506513418470035467> Please provide a valid duration (e.g. 5m).");
        }

        const duration = ms(timeInput);

        if (!duration) {
            return message.reply("<:xMark:1506513418470035467> Please provide a valid duration (e.g. 5m).");
        }

        const reason = args.slice(1).join(" ");

        if (!reason) {
            return message.reply("<:xMark:1506513418470035467> Please provide a reason for your AFK.");
        }

        message.client.afk.set(message.author.id, {
            reason,
            since: Date.now(),
            expires: Date.now() + duration
        });

        // ================= FORMAT TIME =================
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

        let formatted;

        if (hours > 0) {
            formatted = `${hours}h ${minutes}m`;
        } else {
            formatted = `${minutes}m`;
        }

        message.reply(
            `<:check:1506513370625347816> You've been marked as AFK for ${formatted} - ${reason}.`
        );

        // ================= AUTO REMOVE =================
        setTimeout(async () => {

            const afkData = message.client.afk.get(message.author.id);

            if (!afkData) return;

            if (Date.now() >= afkData.expires) {

                message.client.afk.delete(message.author.id);

                await message.author.send(
                    "<:bell:1506530215223099412> Welcome back, your AFK status has been removed."
                ).catch(() => {});
            }

        }, duration);
    }
};