import { Client, Intents } from "discord.js";
import * as commands from "./commands";

const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });

discordClient.once("ready", () => {
  console.log("I am ready!");
});

discordClient.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  await Object.entries(commands)
    .find(([commandName]) => commandName === interaction.commandName)?.[1]
    .execute(interaction);
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);
