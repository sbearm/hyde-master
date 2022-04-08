import { Queue } from "discord-music-player";
import { Intents, Message, ChannelData, VoiceState } from "discord.js";
import { BotConfig } from "./models";

const { Player } = require("discord-music-player");
const https = require("https");
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
  https.get(settings.gist, (res: any) => {
    let data: any[] = [];

    res.on("data", (chunk: any) => {
      data.push(chunk);
    });

    res.on("end", () => {
      let config: BotConfig = JSON.parse(Buffer.concat(data).toString());
      botConfig = config;
      console.log("Ready to go");
    });
  });
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
  if (message.channel.type == "DM" && message.author.id == settings.adminId) {

    let general = client.channels.cache.find(
      (channel: ChannelData) => channel.name === settings.channel
    );

    if (message.content === "play") {
      if (!guildQueue) {
        guildQueue = client.player.createQueue(general.guild.id, {
          leaveOnStop: false,
        });
      }

      await guildQueue.join(general);
      guildQueue.setVolume(70);

      let playUntil = botConfig.Videos[0];
      await guildQueue.play(playUntil.Url, { timecode: true });

      if (playUntil && playUntil.MsSeconds) {
        setTimeout(function () {
          guildQueue.stop();
        }, playUntil.MsSeconds);
      }
    }

    if (message.content === "stop") {
      guildQueue.stop();
    }
  }
});

client.login(settings.token);