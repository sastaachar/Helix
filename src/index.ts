import { config } from "dotenv";
import { Client } from "discord.js";

const cur_env = process.env.NODE_ENV;

cur_env === "development" && config();

try {
  const bot = new Client();
  const TOKEN = process.env.TOKEN;
  console.log(TOKEN);

  bot.login(TOKEN);
} catch (err) {
  console.log(err);
}
