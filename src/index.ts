import { config } from "dotenv";
import Bot from "./Bot";

// * Setup config in development
const cur_env = process.env.NODE_ENV;
cur_env === "development" && config();

const TOKEN = process.env.TOKEN;
try {
  new Bot(TOKEN);
} catch (err) {
  console.log(err);
}
