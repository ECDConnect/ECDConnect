import { render } from '@testing-library/react';
import Mothers from './mother';

describe('Mothers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Mothers />);
    expect(baseElement).toBeTruthy();
  });
});
