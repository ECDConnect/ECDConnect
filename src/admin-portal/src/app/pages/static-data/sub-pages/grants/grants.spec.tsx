import { render } from '@testing-library/react';

import Grants from './grants';

describe('Grants', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Grants />);
    expect(baseElement).toBeTruthy();
  });
});
