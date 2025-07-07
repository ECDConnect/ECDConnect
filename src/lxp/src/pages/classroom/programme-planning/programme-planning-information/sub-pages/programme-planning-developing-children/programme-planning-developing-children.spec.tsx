import { render } from '@testing-library/react';

import ProgrammePlanningDevelopingChildren from './programme-planning-developing-children';

describe('ProgrammePlanningDevelopingChildren', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgrammePlanningDevelopingChildren />);
    expect(baseElement).toBeTruthy();
  });
});
