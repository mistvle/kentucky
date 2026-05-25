const ms = require("ms");

module.exports = {
  name: "messageCreate",

  async execute(client, message) {
    if (message.author.bot) return;

    // ================= KEYWORD EMBEDS =================
    const content = message.content.toLowerCase();

    if (content.includes("how") && content.includes("staff")) {

      await message.channel.send({
        "flags": 32768,
        "components": [
          {
            "type": 17,
            "components": [
              {
                "type": 10,
                "content": "**Staff Application**"
              },
              {
                "type": 10,
                "content": "You can apply to become staff at **Kentucky State Roleplay** using the link below. We offer many benefits for our staff members, along with an incredible High Rank Team & welcoming staff experience."
              },
              {
                "type": 14,
                "divider": false
              },
              {
                "type": 1,
                "components": [
                  {
                    "type": 2,
                    "style": 5,
                    "label": "Staff Application",
                    "url": "https://melonly.xyz/forms/7237583774488203264"
                  }
                ]
              },
              {
                "type": 14,
                "spacing": 2
              },
              {
                "type": 12,
                "items": [
                  {
                    "media": {
                      "url": "https://cdn.discordapp.com/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a12eecf&is=6a119d4f&hm=a9ec55994346800496d8b9dc8bdfd398afe93f8cc1bf25bdc0d50dc6d675ef95"
                    }
                  }
                ]
              }
            ]
          }
        ]
      });

    }

    if (content.includes("how") && content.includes("appeal")) {

      await message.channel.send({
        "flags": 32768,
        "components": [
          {
            "type": 17,
            "components": [
              {
                "type": 10,
                "content": "**Moderation Appeal**"
              },
              {
                "type": 10,
                "content": "You can appeal your recent in-game moderation using the link provided below. Ensure to submit all necessary information & put as much detail into your appeal as possible to increase the chances of your appeal being accepted."
              },
              {
                "type": 14,
                "divider": false
              },
              {
                "type": 1,
                "components": [
                  {
                    "type": 2,
                    "style": 5,
                    "label": "Moderation Appeal",
                    "url": "https://melonly.xyz/forms/7319528804647440384"
                  }
                ]
              },
              {
                "type": 14,
                "spacing": 2
              },
              {
                "type": 12,
                "items": [
                  {
                    "media": {
                      "url": "https://cdn.discordapp.com/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a12eecf&is=6a119d4f&hm=a9ec55994346800496d8b9dc8bdfd398afe93f8cc1bf25bdc0d50dc6d675ef95"
                    }
                  }
                ]
              }
            ]
          }
        ]
      });

    }

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

          const remainingMs = afkData.expires - Date.now();

          const hours = Math.floor(remainingMs / (1000 * 60 * 60));
          const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

          let remaining;

          if (hours > 0) {
            remaining = `${hours}h ${minutes}m`;
          } else {
            remaining = `${minutes}m`;
          }

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