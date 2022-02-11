import { render } from '@testing-library/react';
import NavigationPanel from './navigation-panel';

describe('NavigationPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavigationPanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
