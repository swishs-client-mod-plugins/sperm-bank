/* modified from https://github.com/Cumcord/typings */

declare module '@cumcord' {
  export function uninject(): void;
  export function cum(cockSize?: number, cumshotStrength?: number): string | Promise<string>;
  export * as ui from '@cumcord/ui';
  export * as dev from '@cumcord/dev';
  export * as utils from '@cumcord/utils';
  export * as modules from '@cumcord/modules';
  export * as plugins from '@cumcord/plugins';
  export * as patcher from '@cumcord/patcher';
}

declare module '@cumcord/dev' {
  export function showSettings(): void;
  export function toggleDevMode(): void;
}

declare module '@cumcord/modules' {
  export * as common from '@cumcord/modules/common';
  export * as webpack from '@cumcord/modules/webpack';
  export * as internal from '@cumcord/modules/internal';
}

declare module '@cumcord/modules/webpack' {
  export const modules: any;
  export function find(filter: Function): any;
  export function findAll(filter: Function): any[];
  export function findByProps(...propNames: string[]): any;
  export function findByPropsAll(...propNames: string[]): any[];
  export function findByPrototypes(...protoNames: string[]): any;
  export function findByDisplayName(displayName: String): any;
  export function findByStrings(...searchStrings: string[]): any;
  export function findByKeywordAll(...searchStrings: string[]): any[];
}

declare module '@cumcord/modules/common' {
  export * as uuid from '@cumcord/modules/common/uuid';
  export const Flux: any;
  export const i18n: any;
  export const React: any;
  export const Redux: any;
  export const channels: any;
  export const ReactDOM: any;
  export const constants: any;
  export const highlightjs: any;
  export const zustand: Function;
  export const FluxDispatcher: any;
}

declare module '@cumcord/modules/common/uuid' {
  export function v4(): string;
}

declare module '@cumcord/modules/internal' {
  export * as nests from '@cumcord/modules/internal/nests';
  export * as idbKeyval from '@cumcord/modules/internal/idbKeyval';
}

declare module '@cumcord/modules/internal/idbKeyval' {
  export function get(path: string): Promise<any>;
  export function set(path: string, value: any): Promise<void>;
}

declare module '@cumcord/modules/internal/nests' {
  export function make(obj: any): any;
  export const Events: Record<string, string>;
}

declare module '@cumcord/plugins' {
  export const loaded: Object;
  export const installed: Object;
  export function removePlugin(pluginId: string): void;
  export function togglePlugin(pluginId: string): void;
  export function importPlugin(baseUrl: string): Promise<void>;
}

declare module '@cumcord/patcher' {
  export function unpatchAll(): void;
  export function unpatchAllCss(): void;
  export function injectCSS(newCss?: string): void;
  export function findAndPatch(moduleFinder: () => any, patchCallback: Function): Function;
  export function before(functionName: string, functionParent: Object | Function, callback: (arguments: any[]) => any): () => boolean;
  export function instead(functionName: string, functionParent: Object | Function, callback: (arguments: any[]) => any): () => boolean;
  export function after(functionName: string, functionParent: Object | Function, callback: (arguments: any[], returnValue: any) => any): () => boolean;
}

declare module '@cumcord/utils' {
  export * as logger from '@cumcord/utils/logger';
  export function useNest(nest: Object): void;
  export function copyText(text: string): void;
  export function getOwnerInstance(elem: any): any;
  export function getReactInstance(elem: any): Object;
  export function findInReactTree(tree: any[] | Object, searchFilter: string | ((object: any[] | Object) => boolean)): any;
  export function findInTree(tree: any[] | Object, searchFilter: string | ((object: any[] | Object) => boolean), settings: { walkable?: any[], ignore: any[], limit?: number; }): any;
}

declare module '@cumcord/utils/logger' {
  export function log(...args: any[]): void;
  export function warn(...args: any[]): void;
  export function error(...args: any[]): void;
}

declare module '@cumcord/pluginData' {
  export const persist: any;
  export const id: string;
}

declare module '@cumcord/ui' {
  export * as modals from '@cumcord/ui/modals';
  export * as toasts from '@cumcord/ui/toasts';
}

declare module '@cumcord/ui/modals' {
  export function showConfirmationModal(data: { header?: string, confirmText?: string, cancelText?: string, content?: string, type?: string; }, callback?: (res: boolean) => void): Promise<boolean>;
}

declare module '@cumcord/ui/toasts' {
  export function showToast(data: { title: string, content?: string, onClick?: Function, className?: string, duration?: number; }): void;
}