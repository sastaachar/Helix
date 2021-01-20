import { Command } from "../../commands/command";
import { Message, TextChannel } from "discord.js";

export default class Clear extends Command {
  prefix = "!!!";
  readonly commandValue: string = "CLEAR";
  static command: Command;

  statusChannelId: string;
  messageId: string;

  private constructor() {
    super();
    console.log("\t\tStaring clear...");
  }

  static getCommand = (): Command => {
    if (!Clear.command) {
      Clear.command = new Clear();
    }
    return Clear.command;
  };

  execute = (msg: Message): void => {
    if (msg.channel.type !== "text" || msg.author.username !== "sasta_achar")
      return;
    console.log("clearing");
    const channel = msg.channel as TextChannel;
    channel.messages.fetch().then((mesages) => {
      mesages.forEach((msg) => {
        msg.delete();
      });
    });
  };

  update = (): void => {
    return;
  };
}
