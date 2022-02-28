/* The below source code is licensed under MIT. */

import { findByProps } from '@cumcord/modules/webpack';

const ModalComponents = findByProps('ModalCloseButton');
const ScrollerComponents = findByProps('AdvancedScrollerThin');
const ContextMenuComponents = findByProps('MenuGroup', 'MenuItem');

const Modal = ModalComponents.ModalRoot;

Object.assign(Modal, {
  Sizes: ModalComponents.ModalSize,
  Header: ModalComponents.ModalHeader,
  Footer: ModalComponents.ModalFooter,
  Content: ModalComponents.ModalContent,
  CloseButton: ModalComponents.ModalCloseButton,
});

const ContextMenu = ContextMenuComponents.default;

Object.assign(ContextMenu, {
  Item: ContextMenuComponents.MenuItem,
  Group: ContextMenuComponents.MenuGroup,
  Separator: ContextMenuComponents.MenuSeparator,
  ControlItem: ContextMenuComponents.MenuControlItem,
});

const Scroller = ScrollerComponents.AdvancedScrollerThin;

Object.assign(Scroller, {
  Hide: ScrollerComponents.AdvancedScrollerNone,
  Sizes: { HORIZONTAL: 'horizontal', VERTICAL: 'vertical' }
});

export { Modal, ContextMenu, Scroller };