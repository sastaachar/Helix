import { Message } from "discord.js";
import Bot from "../..";
import { Command, SingletonCommand } from "../../models";
import * as os from "os";

import { find } from "../../controllers/dataCtrl";
import Interaction from "../../models/interaction";
import { updateMessage } from "../../utils/message";
import { timeElapsed } from "../../../common-utils/dateTime";

export default class BotStatus extends SingletonCommand {
  name = "botstatus";

  statusChannelId: string;
  messageId: string;

  botPlatform: string;
  botTimezone: string;

  private constructor(bot: Bot) {
    // aquire data from data model
    super();

    console.log("\t\tStarting BotStatus");
    this.botPlatform = os.platform();
    this.botTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.startCommand(bot);
  }

  startCommand = async (bot: Bot): Promise<void> => {
    const [data, err] = (await find("botstatus")) as [BotStatusData, Error];

    if (err) {
      console.log("\t\t\tBotStatus start failed");
      return;
    }

    this.statusChannelId = data.channelId;
    this.messageId = data.messageId;

    this.updateMessageOnStart(bot);

    console.log("\t\t\tBotStatus started sucessfully");
  };

  static getCommand = (bot: Bot): Command => {
    if (!BotStatus.command) {
      BotStatus.command = new BotStatus(bot);
    }
    return BotStatus.command;
  };

  handleMessageCommand = (options: string[], msg: Message, bot: Bot): void => {
    // parse options

    msg.reply(this.getReplyContent(options, bot, msg));
  };

  handleSlashCommand = async (
    payload: Interaction,
    bot: Bot
  ): Promise<void> => {
    const options = payload.data.options || [];
    const params = options.map((ele) => {
      const opt = ele as unknown as OptionType;
      if (opt.value) return opt.name;
    });

    this.slashReply(
      payload.id,
      payload.token,
      this.getReplyContent(params, bot)
    );
  };

  getReplyContent = (params: string[], bot: Bot, msg?: Message): string => {
    let ans = "```ml";
    params.forEach((opt) => {
      switch (opt) {
        case "u":
        case "uptime": {
          ans += this.getUptime(bot);
          break;
        }

        case "s":
        case "serverstarted": {
          ans += this.getServerStarted(bot);
          break;
        }

        case "p":
        case "ping ": {
          ans += this.getPing(msg);
          break;
        }

        case "t":
        case "timezone": {
          ans += this.getTimezone();
          break;
        }

        case "pl":
        case "platform": {
          ans += this.getPlatform();
          break;
        }
      }
    });

    if (ans === "```ml") {
      ans += this.getUptime(bot);
      ans += this.getServerStarted(bot);
      ans += this.getPlatform();
      ans += this.getTimezone();
      ans += this.getPing(msg);
    }

    ans += "```";
    return ans;
  };

  /**
   * @param bot - The bot that will change
   * @param startedTs - Started Time Stamp
   */
  updateMessageOnStart = (bot: Bot): void => {
    const d = new Date();

    const updatedUptime = `Server started @ ${d.toLocaleString()}`;
    updateMessage(updatedUptime, this.messageId, this.statusChannelId, bot);
  };

  private getUptime = (bot: Bot): string => {
    return `\nUptime : ${timeElapsed(bot.client.uptime)}`;
  };
  private getServerStarted = (bot: Bot): string => {
    const currentTime = bot.client.readyAt;

    const currentOffset = currentTime.getTimezoneOffset();

    const ISTOffset = 330; // IST offset UTC +5:30

    const ISTTime = new Date(
      currentTime.getTime() + (ISTOffset + currentOffset) * 60000
    );

    return `\nServerStarted @ ${ISTTime.toLocaleString("en-IN")}`;
  };

  private getPing = (msg: Message) => {
    if (!msg) return "\nPing : Not available";
    return `\nPing : ${Date.now() - msg.createdTimestamp} ms`;
  };
  private getTimezone = () => {
    return `\nTimezone : ${this.botTimezone} `;
  };
  private getPlatform = () => {
    return `\nPlatform : ${this.botPlatform} `;
  };

  public toString = (): string => this.name;
}

type BotStatusData = {
  channelId?: string;
  messageId?: string;
};

type OptionType = {
  name: string;
  value: string | number;
  type: number;
};
