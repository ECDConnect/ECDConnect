import { LanguageDto } from '@/../../../packages/core/lib';
import { render } from '@testing-library/react';

import LanguageSelector from './language-selector';

describe('LanguageSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <LanguageSelector
        selectLanguage={function (value?: LanguageDto | undefined): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
