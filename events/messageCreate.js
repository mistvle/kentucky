const ms = require("ms");

module.exports = {
  name: "messageCreate",

  async execute(client, message) {
    if (message.author.bot) return;

    // ================= AFK CHECK =================
    let mentionedUser = message.mentions.users.first();

    // replies
    if (!mentionedUser && message.reference) {
      const repliedMsg = await message.channel.messages
        .fetch(message.reference.messageId)
        .catch(() => null);

      if (repliedMsg) {
        mentionedUser = repliedMsg.author;
      }
    }

    if (mentionedUser) {
      const afkData = client.afk?.get(mentionedUser.id);

      if (afkData) {

        // expired
        if (Date.now() > afkData.expires) {

          client.afk.delete(mentionedUser.id);

          const member = await message.client.users
            .fetch(mentionedUser.id)
            .catch(() => null);

          if (member) {
            await member.send(
              "<:bell:1506530215223099412> Welcome back, your AFK status has been removed."
            ).catch(() => {});
          }

        } else {

          const remaining = `<t:${Math.floor(afkData.expires / 1000)}:R>`;

          await message.reply(
            `<:dnd:1506531236871409694> ${mentionedUser.username} is currently **AFK** - ${afkData.reason}, ends in ${remaining}.`
          );
        }
      }
    }

    // ================= PREFIX COMMANDS =================
    if (!message.content.startsWith(client.prefix)) return;

    const args = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/ +/);

    const cmdName = args.shift().toLowerCase();

    const cmd = client.prefixCommands.get(cmdName);
    if (!cmd) return;

    try {
      await cmd.execute(message, args);
    } catch (err) {
      console.error(err);
    }
  }
};