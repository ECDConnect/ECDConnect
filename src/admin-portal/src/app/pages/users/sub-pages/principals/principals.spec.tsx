import { render } from '@testing-library/react';

import Practitioners from './practitioners';

describe('Practitioners', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Practitioners />);
    expect(baseElement).toBeTruthy();
  });
});
