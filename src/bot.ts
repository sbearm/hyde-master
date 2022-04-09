import { Queue } from "discord-music-player";
import { Intents, Message, ChannelData, VoiceState } from "discord.js";
import { play } from "./commands";
import { getConfig } from "./config";
import { BotConfig } from "./models";

const { Player } = require("discord-music-player");

const Discord = require("discord.js");
require("dotenv").config();

module.exports = {
  exec(msg: Message) {},
};

const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
  partials: ["CHANNEL"],
});

const settings = {
  token: process.env.TOKEN,
  channel: process.env.CHANNEL,
  gist: process.env.GIST,
  adminId: process.env.ADMINID,
};

var botConfig: BotConfig;

var guildQueue: Queue;

const player = new Player(client, {
  leaveOnEmpty: false,
});

client.player = player;

client.on("ready", () => {
  getConfig(settings).then((data) => {
    botConfig = JSON.parse(JSON.stringify(data));
  });
  console.log("Ready to go");
});

client.on(
  "voiceStateUpdate",
  async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.id != client.user.id && newState.id != client.user.id) {
      let targetChannel = client.channels.cache.find(
        (channel: ChannelData) => channel.name === settings.channel
      );

      if (newState.channelId === targetChannel.id) {
        console.log("joined");
      }

      if (oldState.channelId === targetChannel.id && !newState.channelId) {
        console.log("left");
      }
    }
  }
);

client.on("messageCreate", async (message: Message) => {
  let args = message.content.split(" ");

  if (message.channel.type == "DM" && message.author.id == settings.adminId) {
    if (args[0] === "play") {
      if (args[1]) {
        let parsed = parseInt(args[1]);
        let options = {
          playIndex: parsed,
        };
        await play(client, guildQueue, settings, botConfig, options);
      } else {
        await play(client, guildQueue, settings, botConfig);
      }
    }

    if (args[0] === "stop") {
      guildQueue.stop();
    }

    if (args[0] === "refresh") {
      console.log('refreshing config')
      getConfig(settings).then((data) => {
        botConfig = JSON.parse(JSON.stringify(data));
        console.log(data)
      });
    }
  }
});

client.login(settings.token);
