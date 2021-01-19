import { Message, TextChannel } from "discord.js";
import Bot from "../../Bot";

/**
 * ! useless
 * @param channel
 * @param content
 */
const sendMessage = async (
  content: string,
  channelId: string,
  bot: Bot
): Promise<Message> => {
  try {
    const channel = bot.client.channels.cache.find((channel) => {
      return channel.valueOf() === channelId;
    }) as TextChannel;
    return await channel.send(content);
  } catch (err) {
    throw err;
  }
};
const updateMessage = async (
  content: string,
  msgId: string,
  channelId: string,
  bot: Bot
): Promise<boolean> => {
  try {
    const channel = bot.client.channels.cache.find((channel) => {
      return channel.valueOf() === channelId;
    }) as TextChannel;

    if (!channel) return false;

    const messages = await channel.messages.fetch();

    const message = messages.find((message) => {
      return message.id === msgId;
    });

    if (!message) return false;

    await message.edit(content);
    return true;
  } catch (err) {
    throw err;
  }
};

const getMessage = async (
  msgId: string,
  channelId: string,
  bot: Bot
): Promise<boolean | Message> => {
  try {
    const channel = bot.client.channels.cache.find((channel) => {
      return channel.valueOf() === channelId;
    }) as TextChannel;

    if (!channel) return false;

    const messages = await channel.messages.fetch();

    const message = messages.find((message) => {
      return message.id === msgId;
    });

    if (!message) return false;

    return message;
  } catch (err) {
    throw err;
  }
};

export { sendMessage, updateMessage, getMessage };
