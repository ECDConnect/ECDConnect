import { fireEvent, render } from '@testing-library/react';

import ButtonGroup from './button-group';
import { ButtonGroupOption } from './models/ButtonGroupOption';
import { ButtonGroupTypes } from './models/ButtonGroupTypes';

describe('ButtonGroup', () => {
  test('should render successfully', () => {
    const options: ButtonGroupOption<number>[] = [
      {
        text: 'option-1',
        value: 1,
      },
      {
        text: 'option-2',
        value: 1,
      },
      {
        text: 'option-3',
        value: 1,
      },
    ];

    const { baseElement, getByText } = render(
      <ButtonGroup
        options={options}
        onOptionSelected={jest.fn()}
        selectedOptions={[]}
        type={ButtonGroupTypes.Button}
      />
    );
    expect(baseElement).toBeTruthy();

    for (const option of options) {
      const renderedOption = getByText(option.text);

      expect(renderedOption).toBeDefined();
    }
  });

  test('should fire onOptionSelected when option is clicked', () => {
    const onOptionSelectedMock = jest.fn();

    const options: ButtonGroupOption<number>[] = [
      {
        text: 'option-1',
        value: 1,
      },
      {
        text: 'option-2',
        value: 1,
      },
      {
        text: 'option-3',
        value: 1,
      },
    ];

    const { baseElement, getByText } = render(
      <ButtonGroup
        options={options}
        onOptionSelected={onOptionSelectedMock}
        selectedOptions={[]}
        type={ButtonGroupTypes.Button}
      />
    );

    for (const option of options) {
      const renderedOption = getByText(option.text);
      fireEvent.click(renderedOption);
    }

    expect(onOptionSelectedMock).toBeCalledTimes(3);
  });
});
