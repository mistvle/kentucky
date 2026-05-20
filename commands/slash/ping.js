const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Shows bot latency"),

  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;

    await interaction.reply({
      "flags": 32768,
      "components": [
        {
          "type": 17,
          "components": [
            {
              "type": 10,
              "content": "## Bot Stats\n**Status**: Online\n**Latency**: `" + latency + "ms`"
            }
          ]
        }
      ]
    });
  }
};