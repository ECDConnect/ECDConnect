import { render } from '@testing-library/react';
import ProvincePanel from './province-panel';

describe('ProvincePanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProvincePanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
