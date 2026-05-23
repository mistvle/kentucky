const interactionCreate = require("../../events/interactionCreate")

module.exports = {
    name: "staff",

    async execute (message, args) {
        await message.reply({
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
              "url": "https://melonly.xyz/forms/7237583774488203264",
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