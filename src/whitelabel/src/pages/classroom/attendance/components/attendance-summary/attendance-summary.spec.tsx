import { render } from '@testing-library/react';

import { AttendanceSummary } from './attendance-summary';

describe('AttendanceSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AttendanceSummary />);
    expect(baseElement).toBeTruthy();
  });
});
