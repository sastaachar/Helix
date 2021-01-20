export type Song = {
  name: string;
};

export type Playlist = {
  name: string;
  closed: boolean;
  author: string;
  messageId: string;
  songs: Song[];
};

export type Library = {
  [name: string]: Playlist;
};
