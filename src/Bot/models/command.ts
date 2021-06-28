import { Message } from "discord.js";
import fetch from "node-fetch";
import Bot from "..";
import { Interaction } from "./interaction";

export class Command {
  name: string;

  ready: boolean;

  // buisness logic
  // eslint-disable-next-line
  handleMessageCommand(msg: Message, bot: Bot): void {
    console.log(`${this.name} cannot be called using message`);
  }
  // eslint-disable-next-line
  handleSlashCommand(data: Interaction, bot: Bot): void {
    console.log(`${this.name} cannot be called using slash`);
  }

  async slashReply(
    interactionId: string,
    iteractionToken: string,
    content: string
  ): Promise<boolean> {
    const url = `https://discord.com/api/v8/interactions/${interactionId}/${iteractionToken}/callback`;

    const json = {
      type: 4,
      data: {
        content,
      },
    };
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(json),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    return res.ok;
  }
}

export abstract class SingletonCommand extends Command {
  static command: SingletonCommand;
  // eslint-disable-next-line
  static getCommand(bot?: Bot): Command {
    throw new Error("not implemented");
  }
}
