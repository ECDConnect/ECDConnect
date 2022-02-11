import { render } from '@testing-library/react';

import ProvinceView from './provinces';

describe('ProvinceView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProvinceView />);
    expect(baseElement).toBeTruthy();
  });
});
