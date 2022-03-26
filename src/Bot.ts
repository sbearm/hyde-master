import { Intents, Message } from "discord.js";
import { VIDS } from "./models/util";

module.exports = {
  exec(msg: Message) {
  },
};

require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
const settings = {
  prefix: "!",
  token: process.env.TOKEN,
};

const { Player } = require("discord-music-player");
const player = new Player(client, {
  leaveOnEmpty: false,
});

client.player = player;

client.on("ready", () => {
  console.log("Ready to go");
});

client.on("messageCreate", async (message: Message) => {
  let general = client.channels.cache.get("286326310165413889");

  if (message.content === "play") {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(general);

    let toPlay = VIDS[0];

    let song = await queue.play(toPlay.Url).catch((_: any) => {});
    if (toPlay) {
      setTimeout(function () {
        queue.stop();
      }, toPlay.MsSeconds);
    }
  }
});

client.login(settings.token);
