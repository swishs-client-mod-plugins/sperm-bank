/* The below code is licensed under MIT. */

import Fuse from 'fuse.js';

import { persist } from '@cumcord/pluginData';
import { findByProps } from '@cumcord/modules/webpack';

export { findInReactTree, copyText } from '@cumcord/utils';

const ToastActions = {
  ...findByProps('showToast'),
  ...findByProps('createToast'),
};

const Utilities = class {
  private static _join(prefix: string, classes: (string | string[])[]): string {
    return classes.map(value => (
      `${prefix ? `${prefix}-` : ''}${Array.isArray(value) ? value.join('-') : value}`
    )).join(' ');
  }

  static join = (...classes: (string | string[])[]): string => this._join('', classes);
  static pjoin = (...classes: (string | string[])[]): string => `sperm-bank-${this._join('', classes)}`;
  static cjoin = (prefix: string) => (...classes: (string | string[])[]): string => this._join(`sperm-bank-${prefix}`, classes);

  static callArgs = (...functions: Function[]) => functions.forEach(f => f?.());

  static sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  static fuzzySearch = <T>(array: T[], search: string): T[] => {
    if (!search || search === '') return array;

    const options = {
      threshold: 0.5,
      keys: [
        'content',
        'author.username',
        'embeds.rawTitle',
        'embeds.author.name',
        'embeds.footer.text',
        'embeds.rawDescription',
      ].map((key) => `props.sperm.${key}`)
    };

    const fuse = new Fuse(array, options);
    return fuse.search(search).map((key) => key.item);
  };

  static showToast = (info: string, success?: boolean) => {
    const type = success === undefined ? 0 : success ? 1 : 2;
    ToastActions.showToast(ToastActions.createToast(info, type));
  };
};

export const usePersistState = <T>(key: string, initial: T): [T, (value: T) => void] => {
  const state = persist.ghost.options?.[key] || initial;

  const setState = (value: any) => {
    if (typeof value === 'function')
      value = value(state);

    persist.store.options[key] = value;
  };

  return [state, setState];
};

export const {
  join,
  pjoin,
  cjoin,
  sleep,
  callArgs,
  showToast,
  fuzzySearch,
} = Utilities;
