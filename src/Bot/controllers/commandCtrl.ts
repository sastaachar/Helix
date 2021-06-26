import { Message, TextChannel } from "discord.js";
import Bot from "..";
import { Command } from "../models/";

import BotStatus from "../features/botStatus/botStatus";
import Interaction from "../models/interaction";

const getCommands = (bot: Bot) => [BotStatus.getCommand(bot)];

export class CommandManager {
  botPrefix = "`";
  commands: Map<string, Command>;

  // singleton
  private static manager: CommandManager;
  private constructor(bot: Bot) {
    console.log("\tSetting up commands.....");
    const commands = getCommands(bot);
    this.commands = new Map<string, Command>();
    commands.forEach((command) => {
      this.addCommand(command);
    });
  }
  static getManager = (bot: Bot): CommandManager => {
    if (!CommandManager.manager) {
      CommandManager.manager = new CommandManager(bot);
    }
    return CommandManager.manager;
  };

  addCommand = (cmd: Command): boolean => {
    const key = cmd.name;
    if (this.commands.has(key)) return false;
    this.commands.set(key, cmd);
    return true;
  };

  toString = (): string => {
    let commands = "";
    this.commands.forEach((command) => {
      commands += command + "\n";
    });
    return commands;
  };

  delegateMessage = async (msg: Message, bot: Bot): Promise<void> => {
    const channel = msg.channel;
    if (
      channel.type === "text" &&
      channel.parent.name === "TESTING" &&
      process.env.NODE_ENV !== "development"
    )
      return;

    const [command, ...options] = msg.content.split(" ");

    const commandName = command.substring(1);
    if (this.commands.has(commandName)) {
      this.commands.get(commandName).handleMessageCommand(options, msg, bot);
    }
  };

  delegateSlashCommand = async (
    payload: Interaction,
    bot: Bot
  ): Promise<void> => {
    const channel = (await bot.client.channels.fetch(
      payload.channel_id
    )) as TextChannel;

    if (
      channel.type === "text" &&
      channel.parent.name === "TESTING" &&
      process.env.NODE_ENV !== "development"
    )
      return;

    const commandName = payload.data.name;
    if (this.commands.has(commandName)) {
      this.commands.get(commandName).handleSlashCommand(payload, bot);
    }
  };
}
