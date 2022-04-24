/* The below code is licensed under MIT. */

import { findByProps, findByDisplayName, find as findModule, find } from '@cumcord/modules/webpack';

const Popout = findByDisplayName('Popout');
const CaretIcon = findByDisplayName('Caret');
const Colors = findByProps('colorStatusGreen');
const FormText = findByDisplayName('FormText');
const Button = findModule(m => m.DropdownSizes);
const FormTitle = findByDisplayName('FormTitle');

const ModalActions = findByProps('openModal', 'openModalLazy');

import ImportModal from './ImportModal';
import Receptionist, { RefreshType } from '../../modules/Receptionist';

import { pjoin } from '../../modules/Utilities';
import { Modal, Scroller, ContextMenu } from '../../modules/Modules';

const refreshSwitch = (refreshText: string) => {
  switch (refreshText) {
    case '...':
      return 'bro chill i said i\'m working on it';
    case 'bro chill i said i\'m working on it':
      return 'u deaf?? i said im working on it god dam';
    case 'u deaf?? i said im working on it god dam':
      return 'this is harrassment.';
    case 'this is harrassment.':
      return 'please stop im running out of cases in this switch statement';
    default:
      return 'null';
  }
};

export default ({ event }: { event: ModalEvent; }): JSX.Element => {
  const [refreshText, setRefreshText] = React.useState('Refresh Things');

  const refreshAction = async (type: RefreshType) => {
    if (refreshText !== 'Refresh Things')
      return setRefreshText(refreshSwitch(refreshText));

    // else actually do stuff
    setRefreshText('...');
    await Receptionist.refresh(type);

    event.onClose();
    setRefreshText('Refresh Things');
  };

  return (
    <Modal transitionState={event.transitionState} size={Modal.Sizes.MEDIUM}>
      <Modal.Header className={pjoin('header')}>
        <FormTitle tag='h3'>help for dumbasses (not rly i love u guys {'<'}333)</FormTitle>
        <Modal.CloseButton onClick={event.onClose} />
      </Modal.Header>
      <Modal.Content>
        <Scroller fade={true}>
          <div className={pjoin('help-markdown')}>
            <FormTitle>how add sperm</FormTitle>
            <FormText type='description'>
              option 1: hold shift and click on funny bank button<br />
              option 2: right click on a message then hover over the "deposit message" item, then use ur monkey brain to figure out the rest<br /><br />

              <span style={{ fontWeight: 'bold' }} className={Colors.colorStatusGreen}>protip!!!! (be gineus):</span> clicking the "deposit message" button by itself will note to ur first account<br /><br />

              <img src='https://i.imgur.com/HLCbFA4.png' /><br />
              <img src='https://i.imgur.com/BFAfBK2.png' />
            </FormText><hr />
            <FormTitle>how do i remove a cummy??</FormTitle>
            <FormText type='description'>
              you can either right click the sperm and hit "delete note" or you can hold the "DELETE" (yes its all caps its screeming at u!!) key on your keyboard and click on a sperm and it will go bye bye<br /><br />

              <img src='https://i.imgur.com/zjNfSxh.png' />
            </FormText><hr />
            <FormTitle>how do i move sperm to another account</FormTitle>
            <FormText type='description'>
              right click on the sperm and hover over the "move note" item, then use ur monkey brain to figure out the rest<br /><br />

              <img src='https://i.imgur.com/Qx8DkQR.png' />
            </FormText><hr />
            <FormTitle>help i made a bajillion accounts!!! how do i scroll??????</FormTitle>
            <FormText type='description'>
              hold shift and scroll and itll scroll back and forth<br /><br />

              if ur on a laptop just like use ur two fingers and scroll right or whatever the fuck you guys do<br /><br />

              <img src='https://i.imgur.com/iklWwdC.gif' />
            </FormText><hr />
            <FormTitle>how do i delte accoun?</FormTitle>
            <FormText type='description'>
              right click on it and hit close account or hold delete and click on it<br /><br />

              <img src='https://i.imgur.com/COIDqix.png' />
            </FormText><hr />
            <FormTitle>how do i move accoun?</FormTitle>
            <FormText type='description' style={{ marginBottom: '14px' }}>
              using state of the art programming and copying straight from react-dnds example page you can drag and drop ur accounts with ur finger and brain<br /><br />

              <img src='https://i.imgur.com/4eo5wum.gif' />
            </FormText><hr />
            <FormTitle>Why are you talking like a 4 year old? im not 4?</FormTitle>
            <FormText type='description' style={{ marginBottom: '14px' }}>
              yes you are shut up
            </FormText>
          </div>
        </Scroller>
      </Modal.Content>
      <Modal.Footer>
        <Button
          onClick={() => ModalActions.openModal((event) => <ImportModal event={event} />)}>
          Import Sperms
        </Button>
        <Button
          onClick={event.onClose}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}>
          Cancel
        </Button>
        <div style={{ flex: 'auto' }} />
        <Popout
          spacing={12}
          align={Popout.Align.BOTTOM}
          position={Popout.Positions.LEFT}
          animation={Popout.Animation.TRANSLATE}
          renderPopout={(event) => (
            <ContextMenu onClose={event.closePopout}>
              <ContextMenu.ControlItem
                id='refresh-header'
                control={() => (
                  <h5 className={pjoin(['header', 'menu'])}>Refresh Options:</h5>
                )} />
              <ContextMenu.Separator key='separator' />
              <ContextMenu.Item
                label='Refresh Avatars' id='RA'
                action={() => refreshAction(RefreshType.AVATARS)} />
              <ContextMenu.Item
                label='Refresh Users (+ Avatars)' id='RUA'
                action={() => refreshAction(RefreshType.USERS)} />
              <ContextMenu.Item
                label='Refresh Messages' id='RM'
                action={() => refreshAction(RefreshType.MESSAGES)} />
              <ContextMenu.Item
                label='Refresh All' id='RAA'
                action={() => refreshAction(RefreshType.ALL)} />
            </ContextMenu>
          )}
        >
          {(props) => (
            <Button
              {...props}
              look={Button.Looks.GHOST}
              color={Button.Colors.GREEN}
              className={pjoin(['refresh', 'button', 'container'])}
            >
              <CaretIcon
                width='24' height='24' direction={CaretIcon.Directions.LEFT}
                className={pjoin(['refresh', 'button', 'icon'])} />
              {refreshText}
            </Button>
          )}
        </Popout>
      </Modal.Footer>
    </Modal>
  );
};
