import { render } from '@testing-library/react';
import TrackingAttendanceReport from './tracking-attendance-report';

describe('TrackingAttendanceReport', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TrackingAttendanceReport />);
    expect(baseElement).toBeTruthy();
  });
});
