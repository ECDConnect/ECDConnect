import { render } from '@testing-library/react';

import { VerifyPhoneNumber } from './verify-phone-number';

describe('VerifyPhonenumber', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VerifyPhoneNumber />);
    expect(baseElement).toBeTruthy();
  });
});
