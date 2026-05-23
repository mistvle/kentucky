const axios = require("axios");

module.exports = {
    name: "players",

    async execute(message) {

        try {

            const response = await axios.get(
                "https://api.erlc.gg/v1/server/players",
                {
                    headers: {
                        "Server-Key": process.env.ERLC_API_KEY
                    }
                }
            );

            const players = response.data;

            if (!players.length) {
                return message.reply({
                    content: "<:xMark:1506513418470035467> No players are currently online.",
                    allowedMentions: { repliedUser: false }
                });
            }

            const formattedPlayers = players.map(player => {

                const username = player.Player || "Unknown";
                const robloxId = player.UserID || "Unknown";
                const team = player.Team || "Unknown";

                return `- **${username}:${robloxId}** - ${team}`;
            }).join("\n");

            await message.reply({
                "flags": 32768,
                "components": [
                    {
                        "type": 17,
                        "components": [
                            {
                                "type": 10,
                                "content": "# <:person:1506523692920737822> ER:LC Players"
                            },
                            {
                                "type": 14,
                                "spacing": 2
                            },
                            {
                                "type": 10,
                                "content": formattedPlayers
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
                                            "url": "https://media.discordapp.net/attachments/1505376044474040440/1505728623922122795/Footers_55.png?ex=6a12eecf&is=6a119d4f&hm=a9ec55994346800496d8b9dc8bdfd398afe93f8cc1bf25bdc0d50dc6d675ef95&=&format=webp&quality=lossless&width=2116&height=108"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });

        } catch (err) {
            console.error(err);

            await message.reply({
                content: "<:xMark:1506513418470035467> Failed to fetch ER:LC players.",
                allowedMentions: { repliedUser: false }
            });
        }
    }
};