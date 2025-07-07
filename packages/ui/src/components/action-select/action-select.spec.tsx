import { CameraIcon, GlobeIcon } from '@heroicons/react/solid';
import { fireEvent, render } from '@testing-library/react';

import ActionSelect from './action-select';
import { ActionSelectItem } from './models/ActionSelectItem';

describe('ActionSelect', () => {
  test('should render successfully', () => {
    const options: ActionSelectItem<string>[] = [
      {
        icon: <CameraIcon />,
        title: 'Camera',
        value: 'value_1',
      },
      {
        icon: <GlobeIcon />,
        title: 'Globe',
        value: 'value_2',
      },
    ];

    const { baseElement, getByTestId } = render(
      <ActionSelect
        actions={options}
        onClose={jest.fn}
        onActionSelected={jest.fn()}
        title={''}
      />
    );

    expect(baseElement).toBeTruthy();

    for (let i = 0; i < options.length; i++) {
      const action = getByTestId(`action-select-action-${i}`);

      expect(action).toBeDefined();
    }
  });

  test('should fire on click event with expected value', () => {
    const onValueSelectMock = jest.fn();

    const options: ActionSelectItem<string>[] = [
      {
        icon: <CameraIcon />,
        title: 'Camera',
        value: 'value_1',
      },
      {
        icon: <GlobeIcon />,
        title: 'Globe',
        value: 'value_2',
      },
    ];

    const { baseElement, getByTestId } = render(
      <ActionSelect
        actions={options}
        onClose={jest.fn}
        onActionSelected={onValueSelectMock}
        title={''}
      />
    );

    for (let i = 0; i < options.length; i++) {
      const action = getByTestId(`action-select-action-${i}`);

      fireEvent.click(action);
    }

    expect(baseElement).toBeTruthy();

    expect(onValueSelectMock).toBeCalledTimes(2);
  });

  test('should fire on close when close icon is clicked', () => {
    const onCloseMock = jest.fn();

    const options: ActionSelectItem<string>[] = [];

    const { getByTestId } = render(
      <ActionSelect
        actions={options}
        onClose={onCloseMock}
        onActionSelected={jest.fn()}
        title={''}
      />
    );

    const closeIcon = getByTestId('action-select-close-icon');

    expect(closeIcon).toBeDefined();

    fireEvent.click(closeIcon);

    expect(onCloseMock).toBeCalled();
  });
});
