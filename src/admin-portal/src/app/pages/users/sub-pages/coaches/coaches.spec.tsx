import { render } from '@testing-library/react';

import Coaches from './coaches';

describe('Coaches', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Coaches />);
    expect(baseElement).toBeTruthy();
  });
});
