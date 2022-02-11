import { render } from '@testing-library/react';

import StatusChip, { StatusChipProps } from './status-chip';

describe('StatusChip', () => {
  it('should render successfully ', () => {
    const props: StatusChipProps = {
      text: 'available',
      borderColour: 'white',
      backgroundColour: 'white',
      textColour: 'white',
    };

    const { getByTestId } = render(<StatusChip {...props} />);

    const text = getByTestId('status-chip-text');
    expect(text).toBeDefined();
  });
});
