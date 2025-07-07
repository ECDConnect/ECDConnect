import { render } from '@testing-library/react';

import Relations from './relations';

describe('Relations', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Relations />);
    expect(baseElement).toBeTruthy();
  });
});
