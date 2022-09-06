import { render } from '@testing-library/react';
import HealthCareWorkers from './health-care-worker';

describe('Practitioners', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HealthCareWorkers />);
    expect(baseElement).toBeTruthy();
  });
});
