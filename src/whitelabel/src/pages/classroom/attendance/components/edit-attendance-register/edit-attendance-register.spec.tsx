import { render } from '@testing-library/react';

import EditAttendanceRegister from './edit-attendance-register';

describe('EditAttendanceRegister', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <EditAttendanceRegister
        attendanceDate={new Date()}
        onBack={() => {}}
        onComplete={() => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
