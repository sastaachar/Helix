import { Message, MessageReaction } from "discord.js";
import { spawn } from "child_process";
import * as fs from "fs";

import Bot from "../..";
import { Command, SingletonCommand } from "../../models";
import { OptionType, Interaction } from "../../models";

export default class Run extends SingletonCommand {
  name = "run";

  private constructor() {
    // aquire data from data model
    super();

    console.log("\t\tStarting Run");

    this.startCommand();
  }

  startCommand = async (): Promise<void> => {
    console.log("\t\t\tRun started sucessfully");
  };

  static getCommand = (): Command => {
    if (!Run.command) {
      Run.command = new Run();
    }
    return Run.command;
  };

  handleMessageCommand = (msg: Message, bot: Bot): void => {
    bot;

    // react
    // working on it
    //

    let msgReaction: MessageReaction = null;
    msg
      .react("<a:loadingbuffering:859070451888029706>")
      .then((reactn) => {
        msgReaction = reactn;

        return msg.reply("<a:loadingbuffering:859070451888029706>");
      })
      .then((replyMsg) => {
        this.getReplyContent(msg.content)
          .then((data) => {
            msgReaction.remove();
            msg.react("✅");
            replyMsg.edit(`<@${msg.author.id}>,` + "```" + data + "```");
          })
          .catch((err) => {
            msgReaction.remove();
            msg.react("❌");
            replyMsg.edit(`<@${msg.author.id}>,` + "```" + err.message + "```");
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSlashCommand = async (payload: Interaction): Promise<void> => {
    const options = (payload.data.options as unknown as OptionType[]) || [];
    const params = options.map((ele) => {
      if (ele.value) return ele.name;
    });

    console.log(params);
    this.slashReply(payload.id, payload.token, "not available");
  };

  getReplyContent = (msg: string): Promise<string> => {
    const first = msg.indexOf("```"),
      last = msg.lastIndexOf("```");

    if (first === -1 || last === -1)
      return this._resolvedPromise("Wrong format");

    const codeContent = msg.substring(first, last);

    // separate first line and code
    const breakLine = codeContent.indexOf("\n");
    const firstLine = codeContent.substring(0, breakLine);
    const code = codeContent.substring(breakLine + 1);

    // const [firstLine, code] = codeContent.split("\n", 2);
    const lang = firstLine.substring(3);
    if (lang === "py") {
      return this._execPython(code);
    }

    return this._resolvedPromise("Language currently not supported");
  };

  _resolvedPromise = (s: string): Promise<string> =>
    new Promise((resolve) => resolve(s));

  _execPython = async (code: string): Promise<string> =>
    new Promise((resolve, reject) => {
      // write to file
      const relativePath = "src/Bot/features/run/temp/";
      const fileName = relativePath + Date.now() + ".py";

      fs.writeFile(fileName, code, (err) => {
        if (err) throw new Error("File could not be created");

        try {
          let dataToSend = "";
          let errorMessage = "";
          let timedOut = false;
          // spawn new child process to call the python script
          const python = spawn("python3", [fileName]);
          // collect data from script
          python.stdout.on("data", function (data) {
            dataToSend += data.toString();
          });

          python.stderr.on("data", function (data) {
            errorMessage += data.toString();
          });

          const timeOut = setTimeout(() => {
            // close this

            timedOut = true;
            python.kill();
          }, 3000);

          python.on("close", () => {
            clearTimeout(timeOut);

            fs.unlink(fileName, (err) => {
              if (err)
                reject(new Error("Server Error: Error while closing file"));
            });
            if (timedOut) reject(new Error("Time Limit Exceeded"));
            if (errorMessage) reject(new Error(dataToSend + errorMessage));

            resolve(dataToSend);
          });
        } catch (err) {
          fs.unlink(fileName, (err) => {
            if (err)
              reject(new Error("Server Error: Error while closing file"));
          });
        }
      });
    });

  public toString = (): string => this.name;
}
