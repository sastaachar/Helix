import { Client, TextChannel } from "discord.js";
/**
 * @name - startupHandler
 * @param bot - The client from discord.js
 * @returns - void
 * @description - Updates the server started message on the staus channel for Helix
 *
 */
export default (bot: Client): void => {
  console.log("Discord bot connected !");

  const statusChannelId = "800361324755943494";

  const statusChannel = bot.channels.cache.find((channel) => {
    return channel.valueOf() === statusChannelId;
  }) as TextChannel;

  statusChannel.messages
    .fetch()
    .then((messages) => {
      messages.forEach((message) => {
        if (message.content.includes("Server started")) {
          const d = new Date();
          message.edit(`Server started - ${d.toLocaleString()}`);
        }
      });
    })
    .catch(console.error);
};
