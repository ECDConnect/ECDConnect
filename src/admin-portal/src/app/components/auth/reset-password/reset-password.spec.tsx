import { render } from '@testing-library/react';

import ResetPassword from './reset-password';

describe('forgot-password', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResetPassword />);
    expect(baseElement).toBeTruthy();
  });
});
