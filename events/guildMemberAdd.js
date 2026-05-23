module.exports = {
    name: "guildMemberAdd",

    async execute(client, member) {

        const CHANNEL_ID = "1226555917764399236";

        const channel = member.guild.channels.cache.get("1226555917764399236");
        if (!channel) return;

        await channel.send({
  "content": `Welcome ${member} to **Kentucky State Roleplay**. We hope you have a fantastic time here. You are member \`#${member.guild.memberCount}\`.`,
  "components": [
    {
      "type": 1,
      "components": [
        {
          "style": 2,
          "type": 2,
          "label": `${member.guild.memberCount}`,
          "emoji": {
            "id": "1506523692920737822",
            "name": "person",
            "animated": false
          },
          "disabled": true,
          "flow": {
            "actions": []
          },
          "custom_id": "p_305455994694012929"
        },
        {
          "type": 2,
          "style": 5,
          "label": "Information",
          "url": "https://discord.com/channels/1225971370681438281/1226724471348531290",
        }
      ]
    }
  ]
});

    }
};