import { render } from '@testing-library/react';

import Roles from './roles';

describe('Roles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Roles />);
    expect(baseElement).toBeTruthy();
  });
});
