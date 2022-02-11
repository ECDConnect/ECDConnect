import { render } from '@testing-library/react';

import ContentManagement from './content-management';

describe('ContentManagement', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContentManagement />);
    expect(baseElement).toBeTruthy();
  });
});
