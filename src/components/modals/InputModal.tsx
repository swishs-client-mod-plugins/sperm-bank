/* The below code is licensed under MIT. */

import { findByProps, findByDisplayName } from '@cumcord/modules/webpack';

const Button = findByProps('DropdownSizes');
const FormTitle = findByDisplayName('FormTitle');
const TextInput = findByDisplayName('TextInput');

import { Modal } from '../../modules/Modules';

interface InputModalProps {
  action: Function,
  event: ModalEvent,
  options?: {
    titleText?: string;
    headerText?: string;
    buttonText?: string;
    placeholder?: string,
    initialInput?: string,
  };
}

export default ({ event, action, options }: InputModalProps): JSX.Element => {
  const [input, _setInput] = React.useState(options?.initialInput || '');

  // shove state into an object so memoized funcs can read it
  const inputRef = React.useRef();
  const setInput = (data) => {
    inputRef.current = data;
    _setInput(data);
  };

  const onEnter = (keyPressEvent: KeyboardEvent) => {
    if (keyPressEvent.key !== 'Enter') return;

    action(inputRef.current);
    event.onClose();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', onEnter);
    return () => document.removeEventListener('keydown', onEnter);
  }, []);

  return (
    <Modal transitionState={event.transitionState} size={Modal.Sizes.SMALL}>
      <Modal.Header>
        <FormTitle tag='h3'>{options?.titleText || 'Input Modal'}</FormTitle>
        <Modal.CloseButton onClick={event.onClose} />
      </Modal.Header>
      <div style={{ marginTop: '10px' }} />
      <Modal.Content>
        <FormTitle>{options?.headerText || 'Input Text'}</FormTitle>
        <TextInput
          value={input}
          hideBorder={true}
          onChange={setInput}
          placeholder={options?.placeholder || 'rape LMAO'}
          style={{ marginBottom: '10px' }} />
      </Modal.Content>
      <Modal.Footer>
        <Button
          onClick={() => {
            action(input);
            event.onClose();
          }}
          color={Button.Colors.GREEN}>
          {options?.buttonText || 'Submit'}
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
