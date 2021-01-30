export type Song = {
  name: string;
};

export type Playlist = {
  name: string;
  closed: boolean;
  author: string;
  dispalyMessageId: string;
  dbMessageId: string;
  songs: Song[];
};

export type Library = {
  [name: string]: Playlist;
};
