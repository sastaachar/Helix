import { Message, TextChannel } from "discord.js";
import Bot from "../../Bot";

/**
 * * Sends message to a channel
 * @param content - Content of the message
 * @param channelId - Channel to send message to (Textchannel)
 * @param bot - The bot that will send
 * @returns - void
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

const getMessages = async (
  channelId: string,
  bot: Bot
): Promise<Message[] | boolean> => {
  try {
    const channel = bot.client.channels.cache.find((channel) => {
      return channel.valueOf() === channelId;
    }) as TextChannel;

    if (!channel) return false;

    const messages = await channel.messages.fetch();

    return messages.array();
  } catch (err) {
    throw err;
  }
};

export { sendMessage, updateMessage, getMessage, getMessages };
