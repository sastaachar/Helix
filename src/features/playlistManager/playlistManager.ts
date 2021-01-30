import { Command } from "../../commands/command";
import Bot from "../../Bot";
import { Message } from "discord.js";
import { getMessages, sendMessage, updateMessage } from "../utils/message";
import { Playlist, Library, Song } from "./playlist";
import { getString } from "./views";

export default class PlaylistManager extends Command {
  prefix = "+";
  readonly commandValue: string = "playlist";
  static command: Command;

  playlistsDispChannelId: string;
  playlistDBChannelId: string;
  musicPlayerChannelId: string;
  messageId: string;
  ready: boolean;
  library: Library;

  private constructor(bot: Bot) {
    super();
    this.ready = false;
    console.log("\t\tStaring playlistManager...");
    this.playlistsDispChannelId = "801361682458345502";
    this.playlistDBChannelId = "802225753025544254";
    this.musicPlayerChannelId = "802243987746193438";
    this.library = {};
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
      case "play":
        this.play(args, msg, bot);
        break;
      case "updateList":
        this.updateDisplay(bot);
        break;
      case "reprint":
        this.reprint(bot);
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
    updateMessage(
      updatedUptime,
      this.messageId,
      this.playlistsDispChannelId,
      bot
    );
  };

  reprint = (bot: Bot): void => {
    for (const name in this.library) {
      sendMessage(
        getString(this.library[name]),
        this.playlistsDispChannelId,
        bot
      )
        .then((sentMsg) => {
          this.library[name].dispalyMessageId = sentMsg.id;
          sentMsg.react("❤️");
        })
        .catch(console.error);
    }
  };

  updateList = (bot: Bot): void => {
    getMessages(this.playlistDBChannelId, bot).then((res) => {
      this.library = {};
      if (res) {
        const messages = res as Message[];
        messages.forEach((msg) => {
          try {
            const playlist: Playlist = {
              ...JSON.parse(msg.content),
              dbMessageId: msg.id,
            };
            this.library[playlist.name] = playlist;
          } catch (err) {}
        });
        console.log(this.library);
        this.ready = true;
      }
    });
  };

  updateDisplay = (bot: Bot): void => {
    for (const name in this.library) {
      updateMessage(
        getString(this.library[name]),
        this.library[name].dispalyMessageId,
        this.playlistsDispChannelId,
        bot
      );
    }
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
    const playlist = this.library[name];
    if (!playlist) {
      msg.reply("No such playlist exists.");
      return;
    }

    if (playlist.closed && msg.author.username !== playlist.author) {
      msg.reply("You dont have the permission to edit this playlist.");
      return;
    }

    const songs: Song[] = args
      .slice(3)
      .join(" ")
      .split(",")
      .map((name) => {
        return { name: name.trim() };
      });

    this.library[name].songs = playlist.songs.concat(songs);
    updateMessage(
      getString(this.library[name]),
      playlist.dispalyMessageId,
      this.playlistsDispChannelId,
      bot
    )
      .then((reply) => {
        if (!reply) return;

        return updateMessage(
          JSON.stringify(this.library[name]),
          playlist.dbMessageId,
          this.playlistDBChannelId,
          bot
        );
      })

      .catch(console.error);
  };

  /**
   *
   * @param args
   * @param msg
   * @param bot
   * @returns
   */
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
      author: msg.author.username,
      closed: closed,
      songs: [],
      dbMessageId: "",
      dispalyMessageId: "",
    };

    this.library[name] = playlist;
    sendMessage(getString(this.library[name]), this.playlistsDispChannelId, bot)
      .then((sentMsg) => {
        this.library[name].dispalyMessageId = sentMsg.id;
        sentMsg.react("❤️");
        return sendMessage(
          JSON.stringify(playlist),
          this.playlistDBChannelId,
          bot
        );
      })
      .then((sentMsg) => {
        // no need to update in db channel
        this.library[name].dbMessageId = sentMsg.id;
      })
      .catch(console.error);
  };
  play = (args: string[], msg: Message, bot: Bot): void => {
    if (args.length < 3) {
      msg.reply("no play list name provided.");
      return;
    }

    const name = args[2].toLowerCase();
    const playlist = this.library[name];
    if (!playlist) {
      msg.reply("Playlist does'nt exists.");
      return;
    }

    playlist.songs.forEach(async (song) => {
      await sendMessage(`!p ${song.name}`, this.musicPlayerChannelId, bot);
    });
  };
}
