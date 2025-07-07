import { render } from '@testing-library/react';

import ProgrammeTutorial from './programme-tutorial';

describe('ProgrammeTutorial', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgrammeTutorial />);
    expect(baseElement).toBeTruthy();
  });
});
