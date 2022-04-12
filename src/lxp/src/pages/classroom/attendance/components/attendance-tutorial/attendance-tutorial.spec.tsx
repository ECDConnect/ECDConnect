import { render } from '@testing-library/react';

import AttendanceTutorial from './attendance-tutorial';

describe('AttendanceTutorial', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AttendanceTutorial onClose={() => {}} onComplete={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
