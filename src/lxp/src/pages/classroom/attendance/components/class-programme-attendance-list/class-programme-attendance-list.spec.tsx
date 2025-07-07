import { render } from '@testing-library/react';

import { AttendanceList } from './attendance-list';

describe('CompleteProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AttendanceList />);
    expect(baseElement).toBeTruthy();
  });
});
