import { render } from '@testing-library/react';
import Infants from './infant';

describe('Infants', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Infants />);
    expect(baseElement).toBeTruthy();
  });
});
