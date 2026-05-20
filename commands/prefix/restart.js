module.exports = {
    name: 'restart',

    async execute (message, args) {
        const isAdmin = message.member.permissions.has("Administrator");
        if (!isAdmin) {
            return message.reply("<:xMark:1506513418470035467> You are not permitted to restart the bot.")

        }

        const msg = await message.reply("<a:loading:1506527267818569749> Restarting...")
        setTimeout(async () => {
    await msg.edit({
        content: "~~<a:loading:1506527267818569749> Restaring.~~\n<:check:1506513370625347816> Successfully restarted bot."
    });
}, 5000);
    }
}