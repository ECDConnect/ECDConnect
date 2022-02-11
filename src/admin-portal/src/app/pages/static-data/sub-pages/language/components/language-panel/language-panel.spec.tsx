import { render } from '@testing-library/react';
import LanguagePanel from './language-panel';

describe('LanguagePanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LanguagePanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
