import { Queue } from "discord-music-player";
import { ChannelData, Client } from "discord.js";
import { Video } from "./models";

export async function play(
  client: any,
  guildQueue: any,
  settings: any,
  botConfig: any,
  options: any = {}
) {
  let general = client.channels.cache.find(
    (channel: ChannelData) => channel.name === settings.channel
  );

  guildQueue = client.player.createQueue(general.guild.id, {
    leaveOnStop: false,
  });

  await guildQueue.join(general);
  guildQueue.setVolume(50);

  var playUntil: Video;

  if (options.playIndex != undefined) {
    playUntil = botConfig.Videos[options.playIndex];
  } else {
    let randIndex = Math.round(0 + Math.random() * botConfig.Videos.length);
    playUntil = botConfig.Videos[randIndex];
  }

  if (playUntil) {
    await guildQueue.play(playUntil.Url, { timecode: true });

    if (playUntil && playUntil.MsSeconds) {
      setTimeout(function () {
        guildQueue.stop();
      }, playUntil.MsSeconds);
    }
  }
}
