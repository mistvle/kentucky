require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.prefix = "-";
const db = require("./db");

// collections
client.prefixCommands = new Collection();
client.slashCommands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();
client.db = db;

client.reminderInterval = null;
// afk
client.afk = new Map();

// handlers
require("./handlers/commandHandler")(client);
require("./handlers/eventHandler")(client);
require("./handlers/buttonHandler")(client);
require("./handlers/menuHandler")(client);
require("./handlers/modalHandler")(client);

client.login(process.env.DISCORD_TOKEN);