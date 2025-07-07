import { render } from '@testing-library/react';

import { ChildList } from './child-list';

describe('CompleteProfile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChildList />);
    expect(baseElement).toBeTruthy();
  });
});
