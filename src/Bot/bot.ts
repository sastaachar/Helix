import { Client, Message } from "discord.js";
import startupCtrl from "./controllers/startupCtrl";
import commandCtrl, { CommandManager } from "./controllers/commandCtrl";
import { timeElapsed } from "../utils/dateTime";

export default class Bot {
  readonly token: string;
  public client: Client;
  startedAt: number;

  constructor(token: string) {
    console.log("Initializing bot !!!");
    this.token = token;
    this.client = new Client();

    console.log("Helix is logging in.");
    this.client
      .login(this.token)
      .then(() => {
        console.log("\tLogin Sucess.");
        this.startedAt = Date.now();
      })
      .catch((error) => {
        console.log("\tLogin Fail.");
        throw error;
      });

    this.client.on("ready", () => {
      // complete starup process
      this.startupHandler();

      // initialize commands
      CommandManager.getManager(this);
    });
    this.client.on("message", this.messageHandler);
  }

  startupHandler = (): void => {
    startupCtrl();
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
