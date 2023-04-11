import { render } from '@testing-library/react';

import { CoachRegistration } from './coach-registation';

describe('CoachRegistration', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CoachRegistration />);
    expect(baseElement).toBeTruthy();
  });
});
