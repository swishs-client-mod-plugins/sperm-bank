/* modified from https://github.com/Cumcord/typings */

declare module '@cumcord' {
  export function uninject(): void;
  export function cum(cockSize?: number, cumshotStrength?: number): string | Promise<string>;
  namespace dev {
    export function showSettings(): void;
    export function toggleDevMode(): void;
  }
  namespace modules {
    namespace webpack {
      export const modules: any;
      export function find(filter: Function): undefined | any | Function;
      export function findAll(filter: Function): Array<any | Function>;
      export function findByProps(...propNames: Array<String>): undefined | any | Function;
      export function findByPropsAll(...propNames: Array<String>): Array<any | any | Function>;
      export function findByPrototypes(...protoNames: Array<String>): Array<any | any | Function>;
      export function findByDisplayName(displayName: String): any;
      export function findByStrings(...searchStrings: Array<String>): undefined | any | Function;
      export function findByKeywordAll(...searchStrings: Array<String>): Array<any | any | Function>;
    }
    namespace common {
      export const constants: any;
      export const channels: any;
      export const Flux: any;
      export const FluxDispatcher: any;
      export const i18n: any;
      export const React: any;
      export const ReactDOM: any;
      export const Redux: any;
      export const zustand: Function;
      export const highlightjs: any;
      namespace uuid {
        export function v4(): string;
      }
    }
    namespace internal {
      namespace idbKeyval {
        export function get(path: string): Promise<any>;
        export function set(path: string, value: any): Promise<void>;
      }
      namespace nests {
        export const Events: Record<string, string>;
        export function make(obj: any): any;
      }
    }
  }
  namespace plugins {
    export function importPlugin(baseUrl: string): Promise<void>;
    export function removePlugin(pluginId: string): void;
    export function togglePlugin(pluginId: string): void;
    export const installed: any;
    export const loaded: any;
  }
  namespace patcher {
    export function before(functionName: string, functionParent: any | Function, callback: (arguments: Array<any | any | Function>) => any): () => boolean;
    export function after(functionName: string, functionParent: any | Function, callback: (arguments: Array<any | any | Function>, returnValue: any) => any): () => boolean;
    export function instead(functionName: string, functionParent: any | Function, callback: (arguments: Array<any | any | Function>) => any): () => boolean;
    export function injectCSS(newCss?: string): void;
  }
  namespace utils {
    export function findInTree(tree: Array<any> | any, searchFilter: string | ((any: Array<any> | any) => boolean), settings: { walkable?: Array<any>, ignore: Array<any>, limit?: number; }): any;
    export function findInReactTree(tree: Array<any> | any, searchFilter: string | ((any: Array<any> | any) => boolean)): any;
    export function copyText(text: string): void;
    export function getOwnerInstance(elem: any): any;
    export function getReactInstance(elem: any): any;
    namespace logger {
      export function log(...args: Array<any>): void;
      export function warn(...args: Array<any>): void;
      export function error(...args: Array<any>): void;
    }
    export function useNest(nest: any): void;
  }
  namespace ui {
    namespace modals {
      export function showConfirmationModal(data: { header?: string, confirmText?: string, cancelText?: string, content?: string, type?: string; }, callback?: (res: boolean) => void): Promise<boolean>;
    }
    namespace toasts {
      export function showToast(data: { title: string, content?: string, onClick?: Function, className?: string, duration?: number; }): void;
    }
  }
}

declare module '@cumcord/dev' {
  export function showSettings(): void;
  export function toggleDevMode(): void;
}

declare module '@cumcord/modules' {
  namespace webpack {
    export const modules: any;
    export function find(filter: Function): undefined | any | Function;
    export function findAll(filter: Function): Array<any | Function>;
    export function findByProps(...propNames: Array<String>): undefined | any | Function;
    export function findByPropsAll(...propNames: Array<String>): Array<any | any | Function>;
    export function findByPrototypes(...protoNames: Array<String>): Array<any | any | Function>;
    export function findByDisplayName(displayName: String): any;
    export function findByStrings(...searchStrings: Array<String>): undefined | any | Function;
    export function findByKeywordAll(...searchStrings: Array<String>): Array<any | any | Function>;
  }
  namespace common {
    export const constants: any;
    export const channels: any;
    export const Flux: any;
    export const FluxDispatcher: any;
    export const i18n: any;
    export const React: any;
    export const ReactDOM: any;
    export const Redux: any;
    export const zustand: Function;
    export const highlightjs: any;
    namespace uuid {
      export function v4(): string;
    }
  }
  namespace internal {
    namespace idbKeyval {
      export function get(path: string): Promise<any>;
      export function set(path: string, value: any): Promise<void>;
    }
    namespace nests {
      export const Events: Record<string, string>;
      export function make(obj: any): any;
    }
  }
}

declare module '@cumcord/modules/webpack' {
  export const modules: any;
  export function find(filter: Function): undefined | any | Function;
  export function findAll(filter: Function): Array<any | Function>;
  export function findByProps(...propNames: Array<String>): undefined | any | Function;
  export function findByPropsAll(...propNames: Array<String>): Array<any | any | Function>;
  export function findByPrototypes(...protoNames: Array<String>): Array<any | any | Function>;
  export function findByDisplayName(displayName: String, dexport?: boolean): any;
  export function findByStrings(...searchStrings: Array<String>): undefined | any | Function;
  export function findByKeywordAll(...searchStrings: Array<String>): Array<any | any | Function>;
}

declare module '@cumcord/modules/common' {
  export const constants: any;
  export const channels: any;
  export const Flux: any;
  export const FluxDispatcher: any;
  export const i18n: any;
  export const React: any;
  export const ReactDOM: any;
  export const Redux: any;
  export const zustand: Function;
  export const highlightjs: any;
  namespace uuid {
    export function v4(): string;
  }
}

declare module '@cumcord/modules/common/uuid' {
  export function v4(): string;
}

declare module '@cumcord/modules/internal' {
  namespace idbKeyval {
    export function get(path: string): Promise<any>;
    export function set(path: string, value: any): Promise<void>;
  }
  namespace nests {
    export const Events: Record<string, string>;
    export function make(obj: any): any;
  }
}

declare module '@cumcord/modules/internal/idbKeyval' {
  export function get(path: string): Promise<any>;
  export function set(path: string, value: any): Promise<void>;
}

declare module '@cumcord/modules/internal/nests' {
  export const Events: Record<string, string>;
  export function make(obj: any): any;
}

declare module '@cumcord/plugins' {
  export function importPlugin(baseUrl: string): Promise<void>;
  export function removePlugin(pluginId: string): void;
  export function togglePlugin(pluginId: string): void;
  export const installed: any;
  export const loaded: any;
}

declare module '@cumcord/patcher' {
  export function before(functionName: string, functionParent: any | Function, callback: (arguments: Array<any | any | Function>) => any): () => boolean;
  export function after(functionName: string, functionParent: any | Function, callback: (arguments: Array<any | any | Function>, returnValue: any) => any): () => boolean;
  export function instead(functionName: string, functionParent: any | Function, callback: (arguments: Array<any | any | Function>) => any): () => boolean;
  export function injectCSS(newCss?: string): void;
  export function findAndPatch(moduleFindFunc: () => boolean, functionToRun: (module: any) => any): () => any;
}

declare module '@cumcord/utils' {
  export function findInTree(tree: Array<any> | any, searchFilter: string | ((any: Array<any> | any) => boolean), settings: { walkable?: Array<any>, ignore: Array<any>, limit?: number; }): any;
  export function findInReactTree(tree: Array<any> | any, searchFilter: string | ((any: Array<any> | any) => boolean)): any;
  export function copyText(text: string): void;
  export function getOwnerInstance(elem: any): any;
  export function getReactInstance(elem: any): any;
  namespace logger {
    export function log(...args: Array<any>): void;
    export function warn(...args: Array<any>): void;
    export function error(...args: Array<any>): void;
  }
  export function useNest(nest: any): void;
}

declare module '@cumcord/utils/logger' {
  export function log(...args: Array<any>): void;
  export function warn(...args: Array<any>): void;
  export function error(...args: Array<any>): void;
}

declare module '@cumcord/ui' {
  namespace modals {
    export function showConfirmationModal(data: { header?: string, confirmText?: string, cancelText?: string, content?: string, type?: string; }, callback?: (res: boolean) => void): Promise<boolean>;
  }
  namespace toasts {
    export function showToast(data: { title: string, content?: string, onClick?: Function, className?: string, duration?: number; }): void;
  }
}

declare module '@cumcord/ui/modals' {
  export function showConfirmationModal(data: { header?: string, confirmText?: string, cancelText?: string, content?: string, type?: string; }, callback?: (res: boolean) => void): Promise<boolean>;
}

declare module '@cumcord/ui/toasts' {
  export function showToast(data: { title: string, content?: string, onClick?: Function, className?: string, duration?: number; }): void;
}

declare module '@cumcord/pluginData' {
  export const persist: any;
}