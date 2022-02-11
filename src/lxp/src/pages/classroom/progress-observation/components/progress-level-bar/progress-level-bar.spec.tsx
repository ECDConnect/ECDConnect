import { render } from '@testing-library/react';
import ProgressLevelBar from './progress-level-bar';

describe('ProgressLevelBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgressLevelBar currentLevelId={2} />);
    expect(baseElement).toBeTruthy();
  });
});
