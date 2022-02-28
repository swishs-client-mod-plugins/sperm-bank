/* The below code is licensed under MIT. */

import { findByProps, findByDisplayName } from '@cumcord/modules/webpack';

const Button = findByProps('DropdownSizes');
const FormTitle = findByDisplayName('FormTitle');

import EmptyGraphic from '../sections/EmptyGraphic';
import Receptionist from '../../modules/Receptionist';
import RenderMessage from '../sections/RenderMessage';
import ForEachOptimized from '../sections/ForEachOptimized';

import { Modal, Scroller } from '../../modules/Modules';

interface CloseAccountProps {
  account: string;
  event: ModalEvent;
  setAccount: Function;
}

export default ({ event, account, setAccount }: CloseAccountProps): JSX.Element => {
  const sperms = Receptionist.fetchAccounts()[account];
  return (
    <Modal transitionState={event.transitionState} size={Modal.Sizes.LARGE}>
      <Modal.Header>
        <FormTitle tag='h3'>You want to delete these spermies?? :((</FormTitle>
        <Modal.CloseButton onClick={event.onClose} />
      </Modal.Header>
      <Modal.Content>
        <Scroller fade={true}>
          <ForEachOptimized
            each={Object.keys(sperms || {})}
            fallback={<EmptyGraphic noEasterEgg />}>
            {(sperm) => (
              <RenderMessage
                fromDeleteModal
                account={account}
                sperm={sperms[sperm]} />
            )}
          </ForEachOptimized>
        </Scroller>
      </Modal.Content>
      <Modal.Footer>
        <Button
          color={Button.Colors.RED}
          onClick={() => {
            event.onClose();
            Receptionist.closeAccount(account);
            setAccount(Receptionist.fetchFirstAccount());
          }}>
          Close Account
        </Button>
        <Button
          onClick={event.onClose}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};