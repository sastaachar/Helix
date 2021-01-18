import { Message } from "discord.js";
import Bot from "..";
import CommandManager from "../../commands/commandManager";

export default (msg: Message, bot: Bot): void => {
  const commandManger = CommandManager.getManager();

  const commandString = msg.content.split(" ")[0];
  commandManger.delegate(commandString, msg, bot);
};
