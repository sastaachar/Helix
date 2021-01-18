import { Message } from "discord.js";
import Bot from "../Bot";
import { Command } from "./command";
import commands from "./_commands";

export default class CommandManager {
  commands: Map<string, Command>;

  private static manager: CommandManager;
  private constructor() {
    this.commands = new Map<string, Command>();
    commands.forEach((command) => {
      this.addCommand(command);
    });
  }
  static getManager = (): CommandManager => {
    if (!CommandManager.manager) {
      CommandManager.manager = new CommandManager();
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
