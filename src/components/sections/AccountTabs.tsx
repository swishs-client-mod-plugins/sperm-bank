/* The below code is licensed under MIT. */

import { findByProps, findByDisplayName } from '@cumcord/modules/webpack';

const TabBar = findByDisplayName('TabBar');
const ContextMenuActions = findByProps('openContextMenuLazy');
const ModalActions = findByProps('openModal', 'openModalLazy');

const { useDrag, useDrop } = findByProps('DropTarget', 'useDrop');

const classes = {
  ...findByProps('tabBarContainer'),
  ...findByProps('topPill', 'selected'),
};

import InputModal from '../modals/InputModal';
import CloseAccount from '../modals/CloseAccount';
import Receptionist from '../../modules/Receptionist';

import { pjoin } from '../../modules/Utilities';
import { ForEachOptimized } from './ForEachOptimized';
import { Scroller, ContextMenu } from '../../modules/Modules';

interface AccountTabsProps {
  accounts: Accounts;
  currentAccount: string;
  updateParent: Function;
  setCurrentAccount: Function;
  holdingDelete: React.MutableRefObject<boolean>;
};

interface TabBarItemProps {
  index: number;
  account: string;
  currentAccount: string;
  updateParent: Function;
  setCurrentAccount: Function;
  holdingDelete: React.MutableRefObject<boolean>;
};

interface ContextMenuItemProps {
  event: ModalEvent;
  account: string;
  setCurrentAccount: Function;
}

export default ({ accounts, currentAccount, setCurrentAccount, updateParent, holdingDelete }: AccountTabsProps): JSX.Element => (
  <Scroller.Hide orientation={Scroller.Orientations.HORIZONTAL}
    className={pjoin(['tabbar', 'container'], classes.tabBarContainer)}>
    <TabBar
      type={TabBar.Types.TOP}
      className={pjoin('tabbar', classes.tabBar)}>
      {ForEachOptimized({
        each: Object.keys(accounts),
        exec: (account, index) =>
          <TabBarItem
            index={index}
            account={account}
            updateParent={updateParent}
            holdingDelete={holdingDelete}
            currentAccount={currentAccount}
            setCurrentAccount={setCurrentAccount} />
      })}
    </TabBar >
  </Scroller.Hide >
);

const type = 'SPERMBANK_TABITEM';
// for programmers wanting to emulate this: https://react-dnd.github.io/react-dnd/examples/sortable/cancel-on-drop-outside
// (by the way this specific implementation below will be very slow with many items)
const TabBarItem = ({ index, account, currentAccount, setCurrentAccount, updateParent, holdingDelete }: TabBarItemProps): JSX.Element => {
  const drop = useDrop({
    accept: type,
    hover({ account: hoverAccount }) {
      if (hoverAccount !== account) {
        Receptionist.moveAccount(hoverAccount, index);
        updateParent();
      }
    },
  })[1];

  const drag = useDrag({
    type, item: { account }
  })[1];

  // this is here because i'm manually styling the tabbar.
  // it is possible to use the native "onItemSelect" prop but it was bugging out for me so i'm not using it
  const selected = account !== currentAccount || classes.selected;
  return (
    <TabBar.Item
      id={false} // here so it doesn't bug out tabbar
      onClick={() => {
        if (holdingDelete.current)
          return ModalActions.openModal((event) => {
            return (
              <CloseAccount
                event={event}
                account={account}
                setAccount={setCurrentAccount} />
            );
          });
        setCurrentAccount(account);
      }}
      clickableRef={(node) => drag(drop(node?.ref || null))}
      className={pjoin('tabbar-item', classes.tabBarItem, selected)}
      onContextMenu={(event) => ItemContextMenu({ event, account, setCurrentAccount })}>
      {account}
    </TabBar.Item>
  );
};

const ItemContextMenu = ({ event, account, setCurrentAccount }: ContextMenuItemProps): void => {
  ContextMenuActions.openContextMenu(event, () => (
    <ContextMenu onClose={ContextMenuActions.closeContextMenu}>
      <ContextMenu.Item
        label='Rename Account' id='rename'
        action={() => {
          ModalActions.openModal((event) => (
            <InputModal
              event={event}
              action={(name: string) => {
                Receptionist.renameAccount(account, name);
                setCurrentAccount(name);
              }}
              options={{
                initialInput: account,
                buttonText: 'Rename Account',
                placeholder: 'Swish being horny >:c',
                headerText: 'BLAH BLAH BLAH enter below pls',
                titleText: 'Rename Account (interest won\'t apply)',
              }} />
          ));
        }} />
      <ContextMenu.Item
        color='colorDanger'
        label='Close Account' id='close'
        action={() => {
          ModalActions.openModal((event) => (
            <CloseAccount
              event={event}
              account={account}
              setAccount={setCurrentAccount} />
          ));
        }} />
    </ContextMenu>
  ));
};