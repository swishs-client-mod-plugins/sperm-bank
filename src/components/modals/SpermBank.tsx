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
const Button = findByProps('DropdownSizes');
const classes = findByProps('tabBarContainer');
const FormTitle = findByDisplayName('FormTitle');
const HelpIcon = findByDisplayName('HelpCircle');
const ModalActions = findByProps('openModal', 'openModalLazy');
const SearchPagination = findByDisplayName('SearchPagination');
const SearchBar = findModule(m => m.defaultProps?.useKeyboardNavigation);

interface RenderSpermsProps {
  sperms: Account;
  account: string;
  sortType: SortType;
  searchInput: string;
  closeModal: Function;
  selectedPage: number;
  updateParent: Function;
  holdingDelete: React.MutableRefObject<boolean>;
}

export enum SortType { DA, MD, DAR, MDR };
export default ({ event }: { event: ModalEvent; }): JSX.Element => {
  const [sortType, setSortType] = usePersistState('sortType', SortType.DA);
  const [searchInput, setSearchInput] = usePersistState('searchInput', '');
  const [selectedPage, _setSelectedPage] = usePersistState('selectedPage', 1);
  const [selectedAccount, _setSelectedAccount] = usePersistState('selectedAccount', Receptionist.fetchFirstAccount());

  const forceUpdate = React.useState(0)[1];
  const accounts = Receptionist.fetchAccounts();

  const setSelectedPage = (state: number) => {
    // ModalContent does not pass refs...
    document.querySelector(`.${pjoin('scroller')}`)?.scrollTo(0, 0);
    _setSelectedPage(state);

    // I do not know why this is necessary, but it is.
    forceUpdate(v => ~v);
  };

  const setSelectedAccount = (state: string) => {
    setSelectedPage(0);
    _setSelectedAccount(state);

    // I do not know why this is necessary, but it is.
    forceUpdate(v => ~v);
  };

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

  useNest(persist);
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
            holdingDelete={holdingDelete}
            selectedAccount={selectedAccount}
            setSelectedAccount={setSelectedAccount}
            updateParent={() => forceUpdate(u => ~u)} />
        </div>
        <Modal.Content className={pjoin('scroller')}>
          <RenderSperms
            sortType={sortType}
            account={selectedAccount}
            searchInput={searchInput}
            closeModal={event.onClose}
            selectedPage={selectedPage}
            holdingDelete={holdingDelete}
            sperms={accounts[selectedAccount]}
            updateParent={() => forceUpdate(u => ~u)} />
        </Modal.Content>
      </Flex>
      <Modal.Footer>
        <AccountButton
          account={selectedAccount}
          setAccount={setSelectedAccount} />
        <Button
          onClick={event.onClose}
          look={Button.Looks.LINK}
          color={Button.Colors.TRANSPARENT}
          className={pjoin(['footer', 'button'])}
          style={{ paddingLeft: '5px', paddingRight: '10px' }}>
          Cancel
        </Button>
        <div className={pjoin('pagination')}>
          <SearchPagination
            pageLength={25}
            changePage={setSelectedPage}
            offset={(selectedPage - 1) * 25}
            totalResults={Object.keys(accounts[selectedAccount]).length} />
        </div>
        <SortButton
          sortType={sortType}
          setSortType={setSortType}
          paginated={Object.keys(accounts[selectedAccount]).length > 25} />
      </Modal.Footer>
    </Modal>
  );
};

const RenderSperms = ({ sperms, account, updateParent, sortType, searchInput, closeModal, holdingDelete, selectedPage }: RenderSpermsProps): JSX.Element => {
  let SpermArray: JSX.Element | JSX.Element[] = (
    ForEachOptimized({
      fallback: <EmptyGraphic />,
      each: Object.keys(sperms || {}).slice((selectedPage - 1) * 25, selectedPage * 25),
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
