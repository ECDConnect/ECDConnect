import { render } from '@testing-library/react';

import ReasonForLeaving from './reason-for-leaving';

describe('ReasonForLeaving', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReasonForLeaving />);
    expect(baseElement).toBeTruthy();
  });
});
