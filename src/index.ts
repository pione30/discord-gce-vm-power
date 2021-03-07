// @ts-ignore @google-cloud/compute v2.4.3 does not provide any type-declaration files.
import Compute from "@google-cloud/compute";
import Discord from "discord.js";

const discordClient = new Discord.Client();
const googleCompute = new Compute();

discordClient.on("ready", () => {
  console.log("I am ready!");
});

discordClient.on("message", (message) => {
  if (message.content === "ping") {
    message.channel.send("pong");
  }
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);
