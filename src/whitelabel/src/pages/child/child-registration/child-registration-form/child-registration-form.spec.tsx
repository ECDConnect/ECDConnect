import { render } from '@testing-library/react';

import CompleteProfile from './complete-profile';

describe('CompleteProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CompleteProfile />);
    expect(baseElement).toBeTruthy();
  });
});
