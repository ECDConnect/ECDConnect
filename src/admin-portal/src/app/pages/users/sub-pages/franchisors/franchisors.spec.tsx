import { render } from '@testing-library/react';

import Franchisors from './franchisors';

describe('Franchisors', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Franchisors />);
    expect(baseElement).toBeTruthy();
  });
});
