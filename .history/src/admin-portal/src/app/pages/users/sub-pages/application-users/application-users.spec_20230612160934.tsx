import { render } from '@testing-library/react';

import ApplicationAdmins from './application-admins';

describe('ApplicationAdmins', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApplicationAdmins />);
    expect(baseElement).toBeTruthy();
  });
});
