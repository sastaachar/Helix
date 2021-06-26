import { config } from "dotenv";

import Bot from "./Bot";

// * Setup config in development
const cur_env = process.env.NODE_ENV;
cur_env === "development" && config();

const TOKEN = process.env.TOKEN;
const bot = new Bot();
console.log("token : ", TOKEN);
bot
  .start(TOKEN)
  .then(() => {
    console.log("Bot started sucessfully.");
  })
  .catch((err: Error) => {
    console.log("Bot start failed.", "\n\tERROR : " + err.message);
  });
