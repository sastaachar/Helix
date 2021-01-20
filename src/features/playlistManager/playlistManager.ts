import { Command } from "../../commands/command";
import Bot from "../../Bot";
import { Message } from "discord.js";
import { getMessages, sendMessage, updateMessage } from "../utils/message";
import { Playlist, Library } from "./playlist";

export default class PlaylistManager extends Command {
  prefix = "+";
  readonly commandValue: string = "playlist";
  static command: Command;

  playlistsChannelId: string;
  messageId: string;
  ready: boolean;
  library: Library;

  private constructor(bot: Bot) {
    super();
    this.ready = false;
    console.log("\t\tStaring playlistManager...");
    this.playlistsChannelId = "801361682458345502";
    this.updateList(bot);
  }

  static getCommand = (bot: Bot): Command => {
    if (!PlaylistManager.command) {
      PlaylistManager.command = new PlaylistManager(bot);
    }
    return PlaylistManager.command;
  };

  execute = (msg: Message, bot: Bot): void => {
    // posts in status channel
    if (!this.ready) {
      msg.reply("Bot is not ready...");
    }

    const args = msg.content.split(" ");
    const subCommand = args[1];

    switch (subCommand) {
      case "add":
      case "+":
        this.addToPlaylist(args, msg, bot);
        break;
      case "new":
      case "{}":
        this.newPlaylist(args, msg, bot);
        break;
      case "relist":
        this.updateList(bot);
        break;
      default:
        msg.reply("Invalid argument for playlist");
        break;
    }
  };

  /**
   * @param bot - The bot that will change
   * @param startedTs - Started Time Stamp
   */
  update = (bot: Bot): void => {
    const d = new Date();

    const updatedUptime = `Server started @ ${d.toLocaleString()}`;
    updateMessage(updatedUptime, this.messageId, this.playlistsChannelId, bot);
  };

  updateList = (bot: Bot): void => {
    getMessages(this.playlistsChannelId, bot).then((res) => {
      this.library = {};
      if (res) {
        const messages = res as Message[];
        messages.forEach((msg) => {
          try {
            const playlist: Playlist = {
              ...JSON.parse(msg.content),
              messageId: msg.id,
            };
            this.library[playlist.name] = playlist;
          } catch (err) {}
        });

        this.ready = true;
      }
    });
  };

  addToPlaylist = (args: string[], msg: Message, bot: Bot): void => {
    if (args.length < 3) {
      msg.reply("no play list name provided.");
      return;
    }

    if (args.length < 4) {
      msg.reply("no song name provided.");
      return;
    }
    const name = args[2].toLowerCase();
    if (this.library[name]) {
      msg.reply("A playlist with the same name already exists.");
      return;
    }

    const closed = args.length > 3 && args[3] === "c";
    const playlist: Playlist = {
      name,
      author: `<@${msg.author.id}>`,
      closed: closed,
      messageId: "",
      songs: [],
    };
    this.library[name] = playlist;
    sendMessage(
      JSON.stringify(playlist, null, 4),
      this.playlistsChannelId,
      bot
    );
  };
  newPlaylist = (args: string[], msg: Message, bot: Bot): void => {
    if (args.length < 3) {
      msg.reply("no play list name provided.");
      return;
    }
    const name = args[2].toLowerCase();
    if (this.library[name]) {
      msg.reply("A playlist with the same name already exists.");
      return;
    }

    const closed = args.length > 3 && args[3] === "c";
    const playlist: Playlist = {
      name,
      author: `<@${msg.author.id}>`,
      closed: closed,
      messageId: "",
      songs: [],
    };
    const editedString = playlist;
    delete editedString.messageId;
    this.library[name] = playlist;
    sendMessage(
      JSON.stringify(editedString, null, 4),
      this.playlistsChannelId,
      bot
    )
      .then((sentMsg) => {
        this.library[name].messageId = sentMsg.id;
        return sentMsg.react("❤️");
      })
      .catch(console.error);
  };
}
