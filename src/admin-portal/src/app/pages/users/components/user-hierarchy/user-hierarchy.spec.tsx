import { render } from '@testing-library/react';

import UserHierarchy from './user-hierarchy';

describe('UserHierarchy', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserHierarchy userId="" />);
    expect(baseElement).toBeTruthy();
  });
});
