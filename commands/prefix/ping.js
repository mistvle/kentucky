module.exports = {
  name: "ping",

  async execute(message) {
    const latency = Date.now() - message.createdTimestamp;

    await message.reply({
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