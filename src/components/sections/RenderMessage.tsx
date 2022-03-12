/* The below source code is licensed under MIT. */

import { findByProps, find as findModule } from '@cumcord/modules/webpack';

const classes = findByProps('cozyMessage');
const User = findModule(m => m.prototype?.tag);
const Channel = findModule(m => m.prototype?.getGuildId);
const transitionTo = findByProps('transitionTo').transitionTo;
const ContextMenuActions = findByProps('openContextMenuLazy');
const Timestamp = findModule(m => m.prototype?.toDate && m.prototype.month);
const ChannelMessage = findModule(m => m.type?.displayName === 'ChannelMessage');
const Message = findModule(m => m.prototype?.getReaction && m.prototype.isSystemDM);

import ErrorBoundary from './ErrorBoundary';
import Receptionist from '../../modules/Receptionist';

import { ContextMenu } from '../../modules/Modules';
import { ForEachOptimized } from './ForEachOptimized';
import { copyText, pjoin } from '../../modules/Utilities';

interface RenderMessageProps {
  sperm: Sperm;
  account: string;
  closeModal?: Function;
  updateParent?: Function;
  fromDeleteModal?: boolean;
};

interface ContextMenuProps {
  sperm: Sperm;
  account: string;
  closeModal: Function;
  updateParent: Function;
}

export default ({ sperm, account, updateParent, fromDeleteModal, closeModal }: RenderMessageProps): JSX.Element => {
  const isHoldingDelete = React.useRef(false);
  React.useEffect(() => {
    const deleteHandler = (e) => e.key === 'Delete' && (isHoldingDelete.current = e.type === 'keydown');

    document.addEventListener('keydown', deleteHandler);
    document.addEventListener('keyup', deleteHandler);

    return () => {
      document.removeEventListener('keydown', deleteHandler);
      document.removeEventListener('keyup', deleteHandler);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ChannelMessage
        className={pjoin(
          'sperm-render',
          classes.message,
          classes.groupStart,
          classes.cozyMessage,
        )}
        message={
          new Message(
            Object.assign({ ...sperm }, {
              author: new User({ ...sperm.author }),
              timestamp: new Timestamp(new Date(sperm.timestamp)),
              embeds: sperm.embeds.map(embed => embed.timestamp ? Object.assign({ ...embed }, {
                timestamp: new Timestamp(new Date(embed.timestamp))
              }) : embed)
            })
          )
        }
        channel={new Channel({ id: 'sperm-bank' })}
        onClick={() => {
          if (isHoldingDelete.current && !fromDeleteModal) {
            Receptionist.withdraw(account, sperm.id);
            updateParent();
          }
        }}
        onContextMenu={event => {
          if (!fromDeleteModal)
            return (
              ContextMenuActions.openContextMenu(event, () =>
                <NoteContextMenu
                  sperm={sperm}
                  account={account}
                  closeModal={closeModal}
                  updateParent={updateParent}
                />
              )
            );
        }}
      />
    </ErrorBoundary>
  );
};

const NoteContextMenu = ({ sperm, account, updateParent, closeModal }: ContextMenuProps): JSX.Element => {
  const accounts = Receptionist.fetchAccounts(account);
  return (
    <ContextMenu onClose={ContextMenuActions.closeContextMenu}>
      <ContextMenu.Item
        label='Jump to Message' id='jump'
        action={() => {
          transitionTo(`/channels/${sperm.guild_id ?? '@me'}/${sperm.channel_id}/${sperm.id}`);
          closeModal();
        }} />
      <ContextMenu.Item
        label='Copy Text' id='ctext'
        action={() => copyText(sperm.content)} />
      <ContextMenu.Item
        color='colorDanger'
        label='Delete Note' id='delete'
        action={() => {
          Receptionist.withdraw(account, sperm.id);
          updateParent();
        }} />
      {Object.keys(accounts).length > 0 ? (
        <ContextMenu.Item
          label='Move Sperm' id='move'>
          {/* Using the function version because Discord's Menu API is strict */}
          {ForEachOptimized({
            each: Object.keys(accounts),
            exec: (key: string) =>
              <ContextMenu.Item
                label={`Move to ${key}`} id={`move-${key}`}
                action={() => {
                  Receptionist.transfer(account, key, sperm);
                  updateParent();
                }} />
          })}
        </ContextMenu.Item>
      ) : null}
      <ContextMenu.Item
        label='Copy ID' id='cid'
        action={() => copyText(sperm.id)} />
    </ContextMenu>
  );
};