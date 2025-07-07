import { render } from '@testing-library/react';

import { FormInput } from './form-input';

describe('FormField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormInput />);
    expect(baseElement).toBeTruthy();
  });
});
