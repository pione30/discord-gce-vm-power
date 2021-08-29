import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
// @ts-ignore @google-cloud/compute v2.6.0 does not provide any type-declaration files.
import Compute from "@google-cloud/compute";

const setInstanseOption = (option: SlashCommandStringOption) =>
  option
    .setName("instance")
    .setDescription("Instance name (ex. `minecraft`)")
    .setRequired(false);

const setZoneOption = (option: SlashCommandStringOption) =>
  option
    .setName("zone")
    .setDescription(
      "Overriding the default compute zone (ex. `asia-northeast1-a`)"
    )
    .setRequired(false);

const data = new SlashCommandBuilder()
  .setName("gce")
  .setDescription("start/stop GCE VM instance")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("start")
      .setDescription("Start the instance")
      .addStringOption(setInstanseOption)
      .addStringOption(setZoneOption)
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("stop")
      .setDescription("Stop the instance")
      .addStringOption(setInstanseOption)
      .addStringOption(setZoneOption)
  );

const googleCompute = new Compute();

const fetchVM = (interaction: CommandInteraction) => {
  const zone = googleCompute.zone(
    interaction.options.getString("zone") ?? process.env.DEFAULT_COMPUTE_ZONE
  );

  const instanceName =
    interaction.options.getString("instance") ??
    process.env.DEFAULT_INSTANCE_NAME;

  return [zone.vm(instanceName), instanceName];
};

const execute = async (interaction: CommandInteraction): Promise<void> => {
  const subcommand = interaction.options.getSubcommand();
  try {
    if (subcommand === "start") {
      await interaction.deferReply();

      const [vm, instanceName] = fetchVM(interaction);
      const [operation] = await vm.start();
      await operation.promise();
      const vmData = await vm.get();

      await interaction.followUp(
        `${instanceName} started!\nIP address: ${vmData[0].metadata.networkInterfaces[0].accessConfigs[0].natIP}`
      );
    } else if (subcommand === "stop") {
      await interaction.deferReply();

      const [vm, instanceName] = fetchVM(interaction);
      const [operation] = await vm.stop();
      await operation.promise();

      await interaction.followUp(`${instanceName} stopped!`);
    } else {
      throw "This subcommand is not supported.";
    }
  } catch (error) {
    const replyOptions = {
      content: `\`/gce\` command failed: ${error}`,
      ephemeral: true,
    };

    try {
      interaction.replied || interaction.deferred
        ? await interaction.followUp(replyOptions)
        : await interaction.reply(replyOptions);
    } catch (replyError) {
      // Handle error to avoid aborting this process
      console.error(replyError);
    }
  }
};

export { data, execute };
