import { render } from '@testing-library/react';
import AttendingReasonPanel from './attending-reason-panel';

describe('AttendingReasonPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AttendingReasonPanel closeDialog={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
