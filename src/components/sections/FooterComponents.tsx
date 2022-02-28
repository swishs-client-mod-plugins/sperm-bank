/* The below code is licensed under MIT. */

import { findByDisplayName, findByProps, find as findModule } from '@cumcord/modules/webpack';

const Flex = findByDisplayName('Flex');
const Text = findByDisplayName('Text');
const Popout = findByDisplayName('Popout');
const classes = findByProps('quickSelectArrow');
const Button = findModule(m => m.DropdownSizes);
const ModalActions = findByProps('openModal', 'openModalLazy');

import InputModal from '../modals/InputModal';
import CloseAccount from '../modals/CloseAccount';
import Receptionist from '../../modules/Receptionist';

import { SortType } from '../modals/SpermBank';
import { pjoin } from '../../modules/Utilities';
import { ContextMenu } from '../../modules/Modules';

interface AccountButtonProps {
  account: string;
  setAccount: Function;
}

interface SortButtonProps {
  sortType: SortType;
  setSortType: Function;
}

export const AccountButton = (args: AccountButtonProps): JSX.Element => {
  if (args.account === Receptionist.fetchFirstAccount()) {
    return (
      <Button
        color={Button.Colors.GREEN}
        onClick={() => ModalActions.openModal((event) => (
          <InputModal
            event={event}
            options={{
              headerText: 'Input Below!',
              buttonText: 'Open Account',
              placeholder: 'Swish being cute c:',
              titleText: 'Open Account (interest will apply)',
            }}
            action={(name: string) => {
              Receptionist.openAccount(name);
              args.setAccount(name);
            }} />
        ))}>
        Open Account
      </Button>
    );
  } else {
    return (
      <Button
        color={Button.Colors.RED}
        onClick={() => ModalActions.openModal((event) => (
          <CloseAccount event={event} {...args} />
        ))}>
        Close Account
      </Button>
    );
  }
};

const sortSwitch = (sortType: SortType) => {
  switch (sortType) {
    case SortType.DA:
      return 'Date Added';
    case SortType.MD:
      return 'Message Date';
    case SortType.DAR:
      return 'Date Added (Reversed)';
    case SortType.MDR:
      return 'Date Added (Reversed)';
  }
};

export const SortButton = ({ sortType, setSortType }: SortButtonProps) => (
  <div style={{ display: 'flex', flex: 'auto' }}>
    <Flex align={Flex.Align.CENTER} className={classes.quickSelect}>
      <Text className={classes.quickSelectLabel}>Change Sorting:</Text>
      <Popout
        spacing={12}
        align={Popout.Align.RIGHT}
        position={Popout.Positions.BOTTOM}
        animation={Popout.Animation.SCALE}
        renderPopout={(event) => (
          <ContextMenu onClose={event.closePopout}>
            <ContextMenu.ControlItem
              id='sort-header'
              control={() => (
                <h5 className={pjoin(['header', 'menu'])}>Sort Type:</h5>
              )} />
            <ContextMenu.Separator key='separator' />
            <ContextMenu.Item
              label='Date Added' id='DA'
              action={() => setSortType(SortType.DA)} />
            <ContextMenu.Item
              label='Message Date' id='MD'
              action={() => setSortType(SortType.MD)} />
            <ContextMenu.Item
              label='Date Added (Reversed)' id='DAR'
              action={() => setSortType(SortType.DAR)} />
            <ContextMenu.Item
              label='Message Date (Reversed)' id='MDR'
              action={() => setSortType(SortType.MDR)} />
          </ContextMenu>
        )}
      >
        {props => (
          <Flex {...props} grow={0} align={Flex.Align.CENTER} className={classes.quickSelectClick}>
            <Text className={classes.quickSelectValue}>
              {sortSwitch(sortType)}
            </Text>
            <div className={classes.quickSelectArrow} />
          </Flex>
        )}
      </Popout>
    </Flex>
    <div />
  </div>
);