import { Command } from "../../commands/command";
import { timeElapsed } from "../../utils/dateTime";
import Bot from "../../Bot";
import { Message } from "discord.js";
import { getMessage, updateMessage } from "../utils/message";

export default class Uptime extends Command {
  prefix = "#";
  readonly commandValue: string = "uptime";
  statusChannelId: string;
  messageId: string;
  static command: Command;

  private constructor(bot: Bot) {
    super();
    console.log("\t\tStarting uptime...");
    this.statusChannelId = "800361324755943494";
    this.messageId = "801151452177235979";
    this.update(bot);
    getMessage(this.messageId, this.statusChannelId, bot).then((res) => {
      if (res) {
        const msg = res as Message;
        const filter = (reaction) => reaction.emoji.name === "🔄";

        const collector = msg.createReactionCollector(filter);
        collector.on("collect", () => {
          this.update(bot);
        });
      }
    });
  }

  static getCommand = (bot: Bot): Command => {
    if (!Uptime.command) {
      Uptime.command = new Uptime(bot);
    }
    return Uptime.command;
  };

  execute = (msg: Message, bot: Bot): void => {
    // posts in status channel

    msg.reply(`Uptime : ${timeElapsed(Date.now() - bot.startedAt)}`);
  };

  update = (bot: Bot): void => {
    // TODO : store this channel , cause its called many times

    const updatedUptime = `Uptime : ${timeElapsed(Date.now() - bot.startedAt)}`;
    updateMessage(updatedUptime, this.messageId, this.statusChannelId, bot);
  };
}
