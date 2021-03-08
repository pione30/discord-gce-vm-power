// @ts-ignore @google-cloud/compute v2.4.3 does not provide any type-declaration files.
import Compute from "@google-cloud/compute";
import Discord from "discord.js";

const discordClient = new Discord.Client();
const googleCompute = new Compute();

discordClient.on("ready", () => {
  console.log("I am ready!");
});

type operationType = "start" | "stop";

const powerInstance = async (
  message: Discord.Message,
  operationName: operationType,
  instanceName: string,
  zoneName?: string
): Promise<void> => {
  const zone = googleCompute.zone(zoneName ?? process.env.DEFAULT_COMPUTE_ZONE);
  const vm = zone.vm(instanceName);

  switch (operationName) {
    case "start": {
      message.channel.send(`${instanceName} starting...`);

      try {
        const [operation] = await vm.start();
        await operation.promise();
      } catch (error) {
        message.channel.send(`Failed to start ${instanceName}: ${error}`);
        return;
      }

      message.channel.send(`${instanceName} started!`);

      try {
        const vmData = await vm.get();
        message.channel.send(
          `IP address: ${vmData[0].metadata.networkInterfaces[0].accessConfigs[0].natIP}`
        );
      } catch (error) {
        message.channel.send(`Failed to get ${instanceName}: ${error}`);
        return;
      }

      break;
    }
    case "stop": {
      message.channel.send(`${instanceName} stopping...`);

      try {
        const [operation] = await vm.stop();
        await operation.promise();
      } catch (error) {
        message.channel.send(`Failed to stop ${instanceName}: ${error}`);
        return;
      }

      message.channel.send(`${instanceName} stopped!`);

      break;
    }
    default: {
      const strangeOperationName: never = operationName;
      throw new Error(`${strangeOperationName} is strange operation name!`);
    }
  }
};

discordClient.on("message", async (message) => {
  const commands = message.content.split(" ");
  if (commands[0] === ".gce") {
    const [_dotGce, operationName, instanceName, zoneName] = commands;

    if (
      commands.length < 3 ||
      (operationName !== "start" && operationName !== "stop")
    ) {
      message.channel.send("Usage: `.gce (start|stop) <instance-name>`");
      return;
    }

    await powerInstance(message, operationName, instanceName, zoneName);
  }
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);
