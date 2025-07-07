import { render } from '@testing-library/react';
import ClassDashboard from './class-dashboard';

describe('Profile', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClassDashboard />);
    expect(baseElement).toBeTruthy();
  });
});
