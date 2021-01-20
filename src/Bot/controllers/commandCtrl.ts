import { Message } from "discord.js";
import Bot from "..";
import { Command } from "../../commands/command";
import { ServerStarted, Uptime } from "../../features/botStatus";
import Clear from "../../features/clear";
import { PlaylistManager } from "../../features/playlistManager";

const getCommands = (bot: Bot) => [
  Uptime.getCommand(bot),
  ServerStarted.getCommand(bot),
  PlaylistManager.getCommand(bot),
  Clear.getCommand(),
];

export class CommandManager {
  commands: Map<string, Command>;

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
    const key = cmd.prefix + cmd.commandValue;
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

  delegate = (commandString: string, msg: Message, bot: Bot): void => {
    if (this.commands.has(commandString)) {
      this.commands.get(commandString).execute(msg, bot);
    }
  };
}

export default (msg: Message, bot: Bot): void => {
  const commandManger = CommandManager.getManager(bot);

  const commandString = msg.content.split(" ")[0];
  commandManger.delegate(commandString, msg, bot);
};
