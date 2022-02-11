import { render } from '@testing-library/react';

import Race from './race';

describe('Race', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Race />);
    expect(baseElement).toBeTruthy();
  });
});
