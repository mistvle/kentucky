module.exports = {
    name: "appeal",
    async execute (message) {
        await message.reply({
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
              "url": "https://melonly.xyz/forms/7319528804647440384",
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
})
    }
}