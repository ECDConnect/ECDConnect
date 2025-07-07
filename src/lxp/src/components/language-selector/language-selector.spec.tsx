import { render } from '@testing-library/react';

import LanguageSelector from './language-selector';

describe('LanguageSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LanguageSelector />);
    expect(baseElement).toBeTruthy();
  });
});
