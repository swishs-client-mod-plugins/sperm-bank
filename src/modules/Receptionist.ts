/* The below source code is licensed under MIT. */

import { persist } from '@cumcord/pluginData';
import { findByProps } from '@cumcord/modules/webpack';

import { sleep } from './Utilities';
import { FluxDispatcher } from '@cumcord/modules/common';

export enum RefreshType { AVATARS, USERS, MESSAGES, ALL }

export default class Receptionist {
  static fetchAccounts(...exclude: string[]): Accounts {
    const accounts = { ...window['SpermBank']?.sperms || persist.ghost.sperms };

    for (let account of exclude)
      delete accounts[account];

    return Object.keys(accounts ?? {}).length ? accounts : { 'Cummies': {} };
  }

  static fetchFirstAccount() {
    return Object.keys(this.fetchAccounts())?.[0];
  }

  static get bank() {
    return window['SpermBank'] || persist.store;
  }

  static deposit(account: string, msg: any) {
    let accounts = this.fetchAccounts();

    const { message, channel } = msg;

    const sperm: Sperm = {
      id: message.id,
      channel_id: channel.id,
      guild_id: channel.guild_id,
      content: message.content,
      author: {
        id: message.author.id,
        avatar: message.author.avatar,
        discriminator: message.author.discriminator,
        username: message.author.username,
      },
      attachments: message.attachments,
      timestamp: typeof message.timestamp === 'string' ? message.timestamp : message.timestamp.toJSON(),
      embeds: message.embeds.map(embed => embed.timestamp ? Object.assign(embed, {
        timestamp: typeof embed.timestamp === 'string' ? embed.timestamp : embed.timestamp.toJSON()
      }) : embed),
      reactions: message.reactions
    };

    Object.assign(accounts[account], { [message.id]: sperm });

    this.bank.sperms = accounts;
  };

  static withdraw(account: string, spermId: string) {
    let accounts = this.fetchAccounts();

    delete accounts[account][spermId];

    this.bank.sperms = accounts;
  };

  static transfer(current: string, tranferee: string, sperm: Sperm) {
    let accounts = this.fetchAccounts();

    delete accounts[current][sperm.id];

    Object.assign(accounts[tranferee], { [sperm.id]: sperm });

    this.bank.sperms = accounts;
  };

  // static cloneSperm(account: string, sperm: Sperm) {
  //   let accounts = this.fetchAccounts();

  //   Object.assign(accounts[account], { [sperm.id]: sperm });

  //   return this.bank.sperms = accounts;
  // };

  static openAccount(name: string) {
    let accounts = this.fetchAccounts();

    Object.assign(accounts, { [name]: {} });

    this.bank.sperms = accounts;
  };

  static closeAccount(name: string) {
    let accounts = this.fetchAccounts();

    delete accounts[name];

    this.bank.sperms = accounts;
  };

  static renameAccount(name: string, newName: string) {
    let accounts = this.fetchAccounts();

    const index = Object.keys(accounts).indexOf(name);

    Object.assign(accounts, { [newName]: accounts[name] });

    delete accounts[name];

    this.bank.sperms = accounts;
    this.moveAccount(newName, index);
  }

  static moveAccount(name: string, index: number) {
    let accounts = this.fetchAccounts();

    let array = Object.keys(accounts).map((account) => {
      if (account !== name) return [account, accounts[account]];
    }).filter(Boolean);

    array.splice(index, 0, [name, accounts[name]]);

    this.bank.sperms = Object.fromEntries(array);
  }

  // static cloneAccount(account: string, newAccount: string) {
  //   let accounts = this.fetchAccounts();

  //   Object.assign(accounts, { [newAccount]: { ...accounts[account] } });

  //   return this.bank.sperms = accounts;
  // };

  static parsePersonalPins = (account: string, data: string) => {
    let accounts = this.fetchAccounts();

    accounts[account] ??= {};
    const BDNotes = JSON.parse(data).notes;

    for (const guildId in BDNotes) {
      for (const channelId in BDNotes[guildId]) {
        for (const messageId in BDNotes[guildId][channelId]) {
          const note = JSON.parse(BDNotes[guildId][channelId][messageId].message);
          Object.assign(accounts[account], {
            [note.id]: {
              id: note.id,
              channel_id: channelId,
              guild_id: guildId,
              content: note.content,
              author: {
                id: note.author.id,
                avatar: note.author.avatar,
                discriminator: note.author.discriminator,
                username: note.author.username,
              },
              timestamp: note.timestamp,
              attachments: note.attachments,
              embeds: note.embeds,
              reactions: note.reactions
            }
          });
        }
      }
    }

    this.bank.sperms = accounts;
  };

  static parseHolyNotes(data: string) {
    let accounts = this.fetchAccounts();
    let notebooks = JSON.parse(data);

    // encourage pollution!
    Object.keys(notebooks).forEach(notebook => {
      accounts[notebook] ??= {};
      Object.assign(accounts[notebook], notebooks[notebook]);
    });

    this.bank.sperms = accounts;
  }

  static async refresh(type: RefreshType) {
    let accounts = this.fetchAccounts();

    // you can "hard fetch" a user with byProps('fetchProfile') but thats not neccessary here
    const lightFetchUser = findByProps('getUser').getUser;
    const getCachedUser = findByProps('getCurrentUser', 'getUser').getUser;

    const getCachedMessage = findByProps('getMessage', 'getMessages').getMessage;
    const fetchMessages = findByProps('sendMessage').fetchMessages;

    const fetchUser = async (authorid) => {
      const user = await lightFetchUser(authorid);
      if (!user) return;

      // attempt to not get rate limited (too lazy to make an elaborate retry system)
      await sleep(600);

      return user;
    };

    const fakeFetcher = (channel: string, message: string) => ({
      channelId: channel,
      jump: {
        messageId: message,
      },
      limit: 1
    });

    const fetchMessage = async (channelId: string, messageId: string) => {
      await fetchMessages(fakeFetcher(channelId, messageId));

      await new Promise<void>((resolve) => {
        const unsubAndResolve = () => {
          FluxDispatcher.unsubscribe('LOAD_MESSAGES_SUCCESS', unsubAndResolve);
          FluxDispatcher.unsubscribe('LOAD_MESSAGES_FAILURE', unsubAndResolve);
          resolve();
        };

        FluxDispatcher.subscribe('LOAD_MESSAGES_SUCCESS', unsubAndResolve);
        FluxDispatcher.subscribe('LOAD_MESSAGES_FAILURE', unsubAndResolve);

        // discords fetcher isn't that reliable sometimes :)
        setTimeout(resolve, 2000);
      });

      return getCachedMessage(channelId, messageId);
    };

    const refreshUsers = async (onlyAvatar?: boolean) => {
      for (const account in accounts) {
        for (const spermId in accounts[account]) {
          const sperm: Sperm = accounts[account][spermId];
          const user = getCachedUser(sperm.author.id)
            ?? await fetchUser(sperm.author.id);
          if (!user) return;

          Object.assign(accounts[account][spermId].author, {
            avatar: user.avatar,
            username: onlyAvatar ? sperm.author.username : user.username,
            discriminator: onlyAvatar ? sperm.author.discriminator : user.discriminator,
          });
        }
      }
    };

    const refreshMessages = async () => {
      for (const account in accounts) {
        for (const spermId in accounts[account]) {
          const sperm: Sperm = accounts[account][spermId];
          const message = getCachedMessage(sperm.channel_id, sperm.id)
            ?? await fetchMessage(sperm.channel_id, sperm.id);
          if (!message) return;

          Object.assign(accounts[account][spermId], {
            embeds: message.embeds,
            content: message.content,
            reactions: message.reactions,
            attachments: message.attachments,
          });
        }
      }
    };

    switch (type) {
      case RefreshType.AVATARS:
        await refreshUsers(true);
        break;
      case RefreshType.USERS:
        await refreshUsers();
        break;
      case RefreshType.MESSAGES:
        await refreshMessages();
        break;
      case RefreshType.ALL:
        await refreshMessages();
        await refreshUsers();
    }

    this.bank.sperms = accounts;
  };
}