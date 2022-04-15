/* The below code is licensed under MIT. */

import { findByProps, findByDisplayName, find as findModule } from '@cumcord/modules/webpack';

const Divider = findByDisplayName('Divider');
const TextArea = findByDisplayName('TextArea');
const Button = findModule(m => m.DropdownSizes);
const FormTitle = findByDisplayName('FormTitle');
const TextInput = findByDisplayName('TextInput');
const ModalActions = findByProps('openModal', 'openModalLazy');

import { Modal, Scroller } from '../../modules/Modules';
import { cjoin, pjoin, callArgs, showToast, copyText } from '../../modules/Utilities';

import BDIcon from '../icons/BD';
import PCIcon from '../icons/PC';
import BankIcon from '../icons/Bank';
import Logger from '../../modules/Logger';
import Receptionist from '../../modules/Receptionist';

const join = cjoin('import');

interface BDImportProps {
  account: string;
  event: ModalEvent;
  nevent: ModalEvent;
  setAccount: Function;
}

const usingFileSave = typeof Receptionist.bank.open === 'function';
export default ({ event }: { event: ModalEvent; }): JSX.Element => {
  const [account, setAccount] = React.useState('PersonalPins');

  const passProps = { event, account, setAccount };
  return (
    <Modal transitionState={event.transitionState} size={Modal.Sizes.MEDIUM} className={join('root')}>
      <Modal.Content className={join('container')}>
        <div className={join('item')} onClick={() => {
          ModalActions.openModal((event) => <BDImport nevent={event} {...passProps} />);
        }}>
          <BDIcon className={join('icon')} height={48} width={48} />
          <FormTitle className={join('text')}>Import from PersonalPins</FormTitle>
        </div>
        <div className={join('item')} onClick={() => {
          ModalActions.openModal((event) => <PCImport nevent={event} {...passProps} />);
        }}>
          <PCIcon className={join('icon')} height={48} width={48} />
          <FormTitle className={join('text')}>Import from Holy Notes</FormTitle>
        </div>
        <div className={join('item')} onClick={() => {
          if (usingFileSave) Receptionist.bank.open();

          copyText(JSON.stringify(Receptionist.fetchAccounts()));
          showToast('JSON was copied to your clipboard!', true);
        }}>
          <BankIcon className={join('icon')} height={48} width={48} />
          <FormTitle className={join('text')}>{usingFileSave ? 'Open' : 'Copy'} Sperm Bank JSON</FormTitle>
        </div>
      </Modal.Content>
    </Modal>
  );
};

const PCImport = ({ event, nevent }: { event: ModalEvent, nevent: ModalEvent; }): JSX.Element => {
  const [data, setData] = React.useState('');
  const closeModal = () => callArgs(event.onClose, nevent.onClose);
  return (
    <Modal transitionState={nevent.transitionState} size={Modal.Sizes.LARGE}>
      <Modal.Header className={pjoin('header')}>
        <FormTitle tag='h3'>Holy Notes</FormTitle>
        <Modal.CloseButton onClick={closeModal} />
      </Modal.Header>
      <Modal.Content>
        <FormTitle>
          Input the text from your "notes.json" file located at:<br /><br />
          "$INSTALLDIR$\powercord\src\Powercord\plugins\holy-notes\NotesHandler\notes.json"
        </FormTitle>
        <Scroller fade={true}>
          <TextArea
            rows={7}
            value={data}
            autosize={true}
            autofocus={true}
            resizeable={false}
            onChange={setData}
            placeholder={[
              '{',
              '  "Main": {',
              '    "891086774879805452": {',
              '      "id": "891086774879805452",',
              '      "channel_id": "824921608560181261",',
              '      "guild_id": "824921608560181258",',
              '      "content": "rape",',
            ].join('\n')}>
          </TextArea>
        </Scroller>
      </Modal.Content>
      <Modal.Footer>
        <Button
          color={Button.Colors.GREEN}
          onClick={() => {
            try {
              Receptionist.parseHolyNotes(data);
            } catch (error) {
              Logger.error('Fucky wucky:', error);
              showToast('shit uhh something went wrong, open the console for more details', false);
            }

            closeModal();
          }}>
          Parse Data
        </Button>
        <Button
          onClick={closeModal}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const BDImport = ({ event, nevent, account, setAccount }: BDImportProps): JSX.Element => {
  const [data, setData] = React.useState('');
  const closeModal = () => callArgs(event.onClose, nevent.onClose);
  return (
    <Modal transitionState={nevent.transitionState} size={Modal.Sizes.LARGE}>
      <Modal.Header className={pjoin('header')}>
        <FormTitle tag='h3'>PersonalPins</FormTitle>
        <Modal.CloseButton onClick={closeModal} />
      </Modal.Header>
      <Modal.Content>
        <FormTitle>
          Input the text from your "PersonalPins.config.json" file located in your BD Plugins folder.
        </FormTitle>
        <Scroller fade={true}>
          <TextArea
            rows={7}
            value={data}
            autosize={true}
            autofocus={true}
            resizeable={false}
            onChange={setData}
            placeholder={[
              '{',
              '  "choices": {',
              '  "defaultFilter": "channel",',
              '  "defaultOrder": "ascending",',
              '  "defaultSort": "notetime"',
              '  },',
              '  "notes": {',
            ].join('\n')}>
          </TextArea>
        </Scroller>
        <div style={{ marginTop: '20px' }} /><Divider />
        <FormTitle>Add to/open Account</FormTitle>
        <TextInput
          hideBorder={true}
          onChange={setAccount}
          defaultValue={'PersonalPins'}
          style={{ marginBottom: '10px' }}
          note='You can add the notes to pre-existing accounts!' />
        <div style={{ marginTop: '20px' }} />
      </Modal.Content>
      <Modal.Footer>
        <Button
          color={Button.Colors.GREEN}
          onClick={() => {
            try {
              Receptionist.parsePersonalPins(account, data);
            } catch (error) {
              Logger.error('Fucky wucky:', error);
              showToast('shit uhh something went wrong, open the console for more details', false);
            }

            closeModal();
          }}>
          Parse Data
        </Button>
        <Button
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}
          onClick={closeModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};