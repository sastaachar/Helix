import { getFixedLen } from "../../../common-utils/string";
import { Playlist, Song } from "../playlist";

const getString = (playlist: Playlist): string => {
  let str = `\`\`\`ml
Name   : ${playlist.name} 
Author : ${playlist.author} 
Closed : ${playlist.closed ? "Yes" : "No"}\n`;
  playlist.songs.forEach((song: Song, index) => {
    str += `\n${index + 1}. ${getFixedLen(song.name)}`;
  });
  str += "```";
  return str;
};

export { getString };
