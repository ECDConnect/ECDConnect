import { render } from '@testing-library/react';

import StaticData from './static-data';

describe('StaticData', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StaticData />);
    expect(baseElement).toBeTruthy();
  });
});
