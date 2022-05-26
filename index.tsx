/* The below code is licensed under MIT. */

import { after, before, findAndPatch as lazy } from '@cumcord/patcher';
import { findByDisplayName, findByProps } from '@cumcord/modules/webpack';

import Logger from './src/modules/Logger';
import Receptionist from './src/modules/Receptionist';

import { ContextMenu } from './src/modules/Modules';
import { pjoin, join, callArgs, findInReactTree } from './src/modules/Utilities';

import injectStyles from './src/style.scss';
import BankIcon from './src/components/icons/Bank';
import SpermBank from './src/components/modals/SpermBank';

const { TooltipContainer } = findByProps('TooltipContainer');
const { openModal } = findByProps('openModal', 'openModalLazy');

const headerClasses = findByProps('icon', 'isHeader');
const iconClasses = findByProps('iconWrapper', 'clickable');
const MiniPopover = findByDisplayName('MiniPopover', false);
const HeaderBarContainer = findByDisplayName('HeaderBarContainer', false);

let patches: Function[] = [];
patches.push(before('push', patches, ([patch]: [Function]) => {
  try {
    return patch();
  } catch (err) {
    Logger.error('Failed to patch', err, patch);
  }
}));

const patchHeaderBarContainer = () => {
  return after('default', HeaderBarContainer, (_, ret) => {
    const Header = findInReactTree(ret, n => Array.isArray(n.toolbar));
    if (!Header) return Logger.warn('Could not patch the HeaderBar!');

    // check in case things fail to unpatch for whatever reason
    if (findInReactTree(Header.toolbar, n => n?.props?.id === 'sperm')) return;

    Header.toolbar.splice(3, 0,
      <TooltipContainer
        text='Sperm Bank' position='bottom' id='sperm'
        className={join(iconClasses.iconWrapper, iconClasses.clickable)} >
        <BankIcon
          width={24} height={24}
          className={iconClasses.icon}
          onClick={() => openModal((event) => <SpermBank event={event} />)} />
      </TooltipContainer>
    );
  });
};

const patchMessageContextMenu = () => {
  return lazy(() => findByDisplayName('MessageContextMenu', false), (MessageContextMenu) => {
    return after('default', MessageContextMenu, (args, ret) => {
      const MenuItems = findInReactTree(ret, c => Array.isArray(c?.children));
      if (!MenuItems) return Logger.warn('Could not patch MessageContextMenu!');

      // check in case things fail to unpatch for whatever reason
      if (findInReactTree(ret, c => c?.props?.id == 'sperm')) return;

      MenuItems.children.splice(4, 0,
        <ContextMenu.Group>
          <ContextMenu.Item
            id='sperm' label='Deposit Message'
            action={() => Receptionist.deposit(Receptionist.fetchFirstAccount(), args[0])}>
            {Object.keys(Receptionist.fetchAccounts()).map(account => (
              <ContextMenu.Item label={`Deposit to ${account}`} id={account} action={() => {
                Receptionist.deposit(account, args[0]);
              }} />
            ))}
          </ContextMenu.Item>
        </ContextMenu.Group>
      );
    });
  });
};

const patchMiniPopover = () => {
  return after('default', MiniPopover, (args, ret) => {

    // check for if the shift key isn't down
    if (!findInReactTree(ret, c => c?.expanded)?.expanded) return;

    // check in case things fail to unpatch for whatever reason
    if (findInReactTree(ret, c => c?.props?.id == 'sperm')) return;

    ret?.props?.children?.unshift(
      <TooltipContainer id='sperm' position='top' text={`Note to ${Receptionist.fetchFirstAccount()}`}>
        <MiniPopover.Button
          onClick={() => {
            const message = findInReactTree(args, c => c?.message && c.channel);
            if (!message) return;

            Receptionist.deposit(Receptionist.fetchFirstAccount(), message);
          }}
          className={pjoin(['popover', 'icon'], headerClasses.icon)}>
          <BankIcon width={24} height={24} />
        </MiniPopover.Button>
      </TooltipContainer>
    );
  });
};

export default () => {
  return {
    onLoad() {
      patches.push(injectStyles);
      patches.push(patchMiniPopover);
      patches.push(patchHeaderBarContainer);
      patches.push(patchMessageContextMenu);

      // for my debugging purposes; UAYOR
      (window as any).Receptionist = Object.assign({ version: '1.0.0' }, Receptionist);
    },
    onUnload() { callArgs(...patches); }
  };
};
