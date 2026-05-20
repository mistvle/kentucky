module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);

    client.user.setActivity("✨ Kentucky State Roleplay", {
      type: 3 // WATCHING
    });
  }
};