import { render } from '@testing-library/react';

import { ProgrammeDashboard } from './programme-dashboard';

describe('ProgammeList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgrammeDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
