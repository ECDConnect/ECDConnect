import { render } from '@testing-library/react';
import { PractitionerProfile } from './practitioner-profile';

describe('Profile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PractitionerProfile />);
    expect(baseElement).toBeTruthy();
  });
});
