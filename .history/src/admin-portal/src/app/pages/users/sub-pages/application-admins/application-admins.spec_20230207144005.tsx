import { render } from '@testing-library/react';

import ApplicationUsers from './application-users';

describe('ApplicationUsers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApplicationUsers />);
    expect(baseElement).toBeTruthy();
  });
});
