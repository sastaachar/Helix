import { Client, Message, WSEventType } from "discord.js";

import { CommandManager } from "./controllers/commandCtrl";
import { timeElapsed } from "../common-utils/dateTime";

import { Interaction } from "./models";

export default class Bot {
  public botPrefix = ">";
  public client: Client;
  public ready: boolean;

  constructor() {
    console.log("Bot created");
    this.ready = false;
  }

  start = async (token: string): Promise<void> => {
    console.log("Initializing bot !!!");
    this.client = new Client();

    console.log("Helix is logging in.");
    await this.client.login(token);

    this.client.on("ready", this.startupHandler);
    this.client.on("message", this.messageHandler);
    this.client.ws.on(
      "INTERACTION_CREATE" as WSEventType,
      this.slashCommandHandler
    );
  };

  startupHandler = (): void => {
    // complete starup process
    console.log(`Logged in as ${this.client.user.tag}!`);

    // connected to client
    // initialize commands
    CommandManager.getManager(this);
    this.ready = true;
  };

  messageHandler = (msg: Message): void => {
    // filter message
    // command
    if (msg.content[0] !== this.botPrefix) return;

    CommandManager.getManager(this).delegateMessage(msg, this);
  };

  slashCommandHandler = (data: Interaction): void => {
    CommandManager.getManager(this).delegateSlashCommand(data, this);
  };

  upTime = (): string => {
    return timeElapsed(this.client.uptime);
  };
}
