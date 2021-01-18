import { Command } from "../command";
import { timeElapsed } from "../../utils/dateTime";
import Bot from "../../Bot";
import { Message } from "discord.js";

export default class Uptime extends Command {
  prefix = "#";
  readonly commandValue: string = "uptime";
  static command: Command;

  private constructor() {
    super();
    this.commandValue = "uptime";
    this.prefix = "#";
  }

  static getCommand = (): Command => {
    if (!Uptime.command) {
      Uptime.command = new Uptime();
    }
    return Uptime.command;
  };

  execute = (msg: Message, bot: Bot): void => {
    // posts in status channel

    msg.reply(`Uptime : ${timeElapsed(Date.now() - bot.startedAt)}`);
  };
}
