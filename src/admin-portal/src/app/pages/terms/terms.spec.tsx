import { render } from '@testing-library/react';

import TermsPage from './terms';

describe('Terms', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TermsPage />);
    expect(baseElement).toBeTruthy();
  });
});
