type Interaction = {
  version: number;
  type: number;
  token: string;
  member: {
    user: {
      username: string;
      public_flags: number;
      id: string;
      discriminator: string;
      avatar: string;
    };
    roles: [string, string, string];
    premium_since: null;
    permissions: string;
    pending: boolean;
    nick: null;
    mute: boolean;
    joined_at: string;
    is_pending: boolean;
    deaf: boolean;
    avatar: null;
  };
  id: string;
  guild_id: string;
  data: { options: [[unknown]]; name: string; id: string };
  channel_id: string;
  application_id: string;
};

export default Interaction;
