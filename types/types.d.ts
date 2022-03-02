declare const React: typeof import('react');
declare interface ModalEvent {
  onClose: () => void;
  transitionState: number;
}

declare interface Accounts {
  [account: string]: Account;
}

declare interface Account {
  [messageId: string]: Sperm;
}

declare interface Sperm {
  id: string;
  channel_id: string;
  guild_id: string | null;
  content: string;
  author: {
    id: string;
    avatar: string;
    discriminator: string;
    username: string;
  },
  timestamp: string;
  attachments: any[],
  embeds: any[],
  reactions: any[];
}

// Theres not really anything that would be worth adding to code pallete sadly.
// interface PalleteEntry {
//   id: string;
//   icon?: string;
//   label: string;
//   source: string;
//   condition?: () => boolean;
//   action: () => void;
// }

// interface registerType {
//   registerEntry: (entry: PalleteEntry) => void;
// }