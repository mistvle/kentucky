module.exports = {
    name: 'restart',

    async execute (message, args) {
        const ALLOWED_USER_ID = 123456789012345678;

if (message.author.id !== ALLOWED_USER_ID) {
    return message.reply({
        content: "<:xMark:1506513418470035467> You do not have permission to run this command.",
        allowedMentions: { repliedUser: false }
    });
}
        

        const msg = await message.reply("<a:loading:1506527267818569749> Restarting...")
        setTimeout(async () => {
    await msg.edit({
        content: "~~<a:loading:1506527267818569749> Restarting...~~\n<:check:1506513370625347816> Successfully restarted bot."
    });
}, 5000);
    }
}