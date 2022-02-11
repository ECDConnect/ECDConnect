import { render } from '@testing-library/react';

import AttendingReasonsView from './attending-reasons';

describe('AttendingReasonsView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AttendingReasonsView />);
    expect(baseElement).toBeTruthy();
  });
});
