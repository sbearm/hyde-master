import { Intents, Message } from "discord.js";
import { VIDS } from "./models/util";

require("dotenv").config();
const { Player } = require("discord-music-player");

module.exports = {
  exec(msg: Message) {},
};

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});
const settings = {
  token: process.env.TOKEN,
  channel: process.env.CHANNEL,
};

const player = new Player(client, {
  leaveOnEmpty: false,
});

client.player = player;

client.on("ready", () => {
  console.log("Ready to go");
});

client.on("messageCreate", async (message: Message) => {
  let general = client.channels.cache.find(
    (channel) => channel.name === settings.channel
  );

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
