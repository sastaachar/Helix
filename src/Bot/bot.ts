import { Client, Message } from "discord.js";
import startupCtrl from "./controllers/startupCtrl";
import commandCtrl from "./controllers/commandCtrl";
import { timeElapsed } from "../utils/dateTime";

export default class Bot {
  readonly token: string;
  bot: Client;
  startedAt: number;

  constructor(token: string) {
    this.token = token;
    this.bot = new Client();

    this.bot
      .login(this.token)
      .then(() => {
        this.startedAt = Date.now();
      })
      .catch((error) => {
        throw error;
      });

    this.bot.on("ready", this.startupHandler);
    this.bot.on("message", this.messageHandler);
  }

  startupHandler = (): void => {
    startupCtrl(this.bot);
  };
  messageHandler = (msg: Message): void => {
    // filter message
    // command
    commandCtrl(msg, this);
  };

  upTime = (): string => {
    const elapsed = timeElapsed(Date.now() - this.startedAt);

    console.log(elapsed);
    return elapsed;
  };
}
