import { render } from '@testing-library/react';
import { PasswordInput } from '..';

describe('PasswordInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PasswordInput value={''} />);
    expect(baseElement).toBeTruthy();
  });
});
