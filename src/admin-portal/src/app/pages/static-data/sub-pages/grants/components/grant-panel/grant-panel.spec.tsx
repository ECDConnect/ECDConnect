import { render } from '@testing-library/react';
import GrantPanel from './grant-panel';

describe('GrantPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GrantPanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
