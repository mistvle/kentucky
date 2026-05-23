module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {

        const CHANNEL_ID = "CHANNEL_ID";

        const channel = member.guild.channels.cache.get("1226555917764399236");
        if (!channel) return;

        await channel.send({
  "content": `Welcome ${member} to **Kentucky State Roleplay**. We hope you have a fantastic time here. You are member \`#${member.guild.memberCount}\`.`
});

    }
};