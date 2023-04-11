import { render } from '@testing-library/react';
import ProgressTrackingTutorial from './progress-tracking-tutorial';

describe('ProgressTrackingTutorial', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgressTrackingTutorial />);
    expect(baseElement).toBeTruthy();
  });
});
