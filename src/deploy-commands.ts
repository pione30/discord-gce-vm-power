import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import * as commands from "./commands";

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    if (!process.env.DISCORD_BOT_TOKEN) {
      throw "DISCORD_BOT_TOKEN is required!";
    }
    if (!process.env.DISCORD_CLIENT_ID) {
      throw "DISCORD_CLIENT_ID is required!";
    }
    if (!process.env.DISCORD_GUILD_ID) {
      throw "DISCORD_GUILD_ID is required!";
    }

    const rest = new REST({ version: "9" }).setToken(
      process.env.DISCORD_BOT_TOKEN
    );

    const guildCommands = Object.values(commands).map((command) =>
      command.data.toJSON()
    );

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: guildCommands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
