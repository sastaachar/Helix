import { Message } from "discord.js";
import Bot from "../Bot";

export abstract class Command {
  // command related stuff
  prefix: string;
  commandValue: string;
  toString = (): string => {
    return this.prefix + this.commandValue;
  };

  // buisness logic
  abstract execute(msg: Message, bot: Bot): void;
}

/**
 * TODO #1 : use this with the help of TS decorators
 */
export interface SingletonCommand {
  command: Command;
  getCommand(): Command;
}
