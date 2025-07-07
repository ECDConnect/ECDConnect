import { render } from '@testing-library/react';

import AttendanceWidget from './attendance-widget';

describe('AttendanceWidget', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AttendanceWidget />);
    expect(baseElement).toBeTruthy();
  });
});
