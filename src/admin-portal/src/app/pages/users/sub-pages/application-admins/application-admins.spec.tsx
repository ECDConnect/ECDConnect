import { render } from '@testing-library/react';

import ApplicationUsers from './application-admins';

describe('ApplicationUsers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApplicationUsers />);
    expect(baseElement).toBeTruthy();
  });
});
