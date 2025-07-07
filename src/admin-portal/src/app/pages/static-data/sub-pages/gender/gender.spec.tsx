import { render } from '@testing-library/react';

import Gender from './gender';

describe('Gender', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Gender />);
    expect(baseElement).toBeTruthy();
  });
});
