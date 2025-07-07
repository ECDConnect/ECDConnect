import { render } from '@testing-library/react';

import Children from './children';

describe('Children', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Children />);
    expect(baseElement).toBeTruthy();
  });
});
