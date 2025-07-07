import { render } from '@testing-library/react';
import RacePanel from './race-panel';

describe('RacePanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RacePanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
