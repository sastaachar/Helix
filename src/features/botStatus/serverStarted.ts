import { Command } from "../../commands/command";
import Bot from "../../Bot";
import { Message } from "discord.js";
import { updateMessage } from "../utils/message";

export default class ServerStarted extends Command {
  prefix = "#";
  readonly commandValue: string = "serverStarted";
  static command: Command;

  statusChannelId: string;
  messageId: string;

  private constructor(bot: Bot) {
    super();
    console.log("\t\tStaring serverStarted...");
    this.statusChannelId = "800361324755943494";
    this.messageId = "800460549208670208";
    this.update(bot);
  }

  static getCommand = (bot: Bot): Command => {
    if (!ServerStarted.command) {
      ServerStarted.command = new ServerStarted(bot);
    }
    return ServerStarted.command;
  };

  execute = (msg: Message, bot: Bot): void => {
    // posts in status channel

    msg.reply(`Server Started @ ${bot.startedAt}`);
  };

  /**
   * @param bot - The bot that will change
   * @param startedTs - Started Time Stamp
   */
  update = (bot: Bot): void => {
    const d = new Date();

    const updatedUptime = `Server started @ ${d.toLocaleString()}`;
    updateMessage(updatedUptime, this.messageId, this.statusChannelId, bot);
  };
}
