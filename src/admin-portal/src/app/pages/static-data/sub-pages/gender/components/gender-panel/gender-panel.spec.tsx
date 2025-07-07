import { render } from '@testing-library/react';
import GenderPanel from './gender-panel';

describe('GenderPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GenderPanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
