/* The below code is licensed under MIT. */

import { useNest } from '@cumcord/utils';
import { persist } from '@cumcord/pluginData';
import { find as findModule, findByProps, findByDisplayName } from '@cumcord/modules/webpack';

import HelpModal from './HelpModal';
import AccountTabs from '../sections/AccountTabs';
import EmptyGraphic from '../sections/EmptyGraphic';
import RenderMessage from '../sections/RenderMessage';
import Receptionist from '../../modules/Receptionist';

import { Modal } from '../../modules/Modules';
import { ForEachOptimized } from '../sections/ForEachOptimized';
import { AccountButton, SortButton } from '../sections/FooterComponents';
import { pjoin, fuzzySearch, usePersistState } from '../../modules/Utilities';

const Flex = findByDisplayName('Flex');
const classes = findByProps('tabBarContainer');
const Button = findModule(m => m.DropdownSizes);
const FormTitle = findByDisplayName('FormTitle');
const HelpIcon = findByDisplayName('HelpCircle');
const ModalActions = findByProps('openModal', 'openModalLazy');
const SearchBar = findModule(m => m.defaultProps?.useKeyboardNavigation);

interface RenderSpermsProps {
  sperms: Account;
  account: string;
  sortType: SortType;
  searchInput: string;
  closeModal: Function;
  updateParent: Function;
  holdingDelete: React.MutableRefObject<boolean>;
}

export enum SortType { DA, MD, DAR, MDR };
export default ({ event }: { event: ModalEvent; }): JSX.Element => {
  const [sortType, setSortType] = usePersistState('sortType', SortType.DA);
  const [searchInput, setSearchInput] = usePersistState('searchInput', '');
  const [currentAccount, setCurrentAccount] = usePersistState('selectedAccount', Receptionist.fetchFirstAccount());

  useNest(persist);
  const forceUpdate = React.useState(0)[1];
  const accounts = Receptionist.fetchAccounts();

  const holdingDelete = React.useRef(false);
  React.useEffect(() => {
    const deleteHandler = (e) => e.key === 'Delete' && (holdingDelete.current = e.type === 'keydown');

    document.addEventListener('keydown', deleteHandler);
    document.addEventListener('keyup', deleteHandler);

    return () => {
      document.removeEventListener('keydown', deleteHandler);
      document.removeEventListener('keyup', deleteHandler);
    };
  }, []);
  return (
    <Modal transitionState={event.transitionState} className='bank' size={Modal.Sizes.LARGE} style={{ borderRadius: '8px' }}>
      <Flex className={pjoin('flex')} direction={Flex.Direction.VERTICAL} style={{ width: '100%' }}>
        <div className={classes.topSectionNormal}>
          <Modal.Header className={pjoin(['header', 'main'], classes.header)}>
            <FormTitle tag='h4' className={pjoin('heading')}>
              SPERM BANK
            </FormTitle>
            <HelpIcon
              className={pjoin(['flex', 'help', 'icon'])} name='HelpCircle'
              onClick={() => ModalActions.openModal((event) => <HelpModal event={event} />)} />
            <SearchBar
              autofocus={false}
              query={searchInput}
              placeholder='Search'
              className={pjoin('search')}
              size={SearchBar.Sizes.MEDIUM}
              onClear={() => setSearchInput('')}
              onQueryChange={query => setSearchInput(query)} />
            <Modal.CloseButton className={pjoin(['close', 'button'])} onClick={event.onClose} />
          </Modal.Header>
          <AccountTabs
            accounts={accounts}
            currentAccount={currentAccount}
            setCurrentAccount={setCurrentAccount}
            updateParent={() => forceUpdate(u => ~u)} />
        </div>
        <Modal.Content>
          <RenderSperms
            sortType={sortType}
            account={currentAccount}
            searchInput={searchInput}
            closeModal={event.onClose}
            holdingDelete={holdingDelete}
            sperms={accounts[currentAccount]}
            updateParent={() => forceUpdate(u => ~u)} />
        </Modal.Content>
      </Flex>
      <Modal.Footer>
        <AccountButton
          account={currentAccount}
          setAccount={setCurrentAccount} />
        <Button
          onClick={event.onClose}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}
          style={{ paddingLeft: '5px', paddingRight: '10px' }}>
          Cancel
        </Button>
        <SortButton
          sortType={sortType}
          setSortType={setSortType} />
      </Modal.Footer>
    </Modal>
  );
};

const RenderSperms = ({ sperms, account, updateParent, sortType, searchInput, closeModal, holdingDelete }: RenderSpermsProps): JSX.Element => {
  let SpermArray: JSX.Element | JSX.Element[] = (
    ForEachOptimized({
      fallback: <EmptyGraphic />,
      each: Object.keys(sperms || {}),
      exec: (sperm) => (
        <RenderMessage
          account={account}
          sperm={sperms[sperm]}
          closeModal={closeModal}
          updateParent={updateParent}
          holdingDelete={holdingDelete} />
      )
    })
  );

  if (Array.isArray(SpermArray)) {
    if (searchInput.trim() !== '')
      SpermArray = fuzzySearch(SpermArray, searchInput.trim());

    if (sortType === SortType.MD || sortType === SortType.MDR)
      SpermArray = SpermArray.sort((a, b) =>
        new Date(b.props.sperm.timestamp).getTime() -
        new Date(a.props.sperm.timestamp).getTime()
      );

    // Don't ask me why it's like this; I have no idea.
    if (sortType !== SortType.DAR && sortType !== SortType.MDR)
      SpermArray.reverse();
  }

  return <>{SpermArray}</>;
};