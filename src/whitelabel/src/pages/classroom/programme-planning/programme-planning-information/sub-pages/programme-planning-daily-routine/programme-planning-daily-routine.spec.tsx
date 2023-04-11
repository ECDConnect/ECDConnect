import { render } from '@testing-library/react';

import ProgrammePlanningDailyRoutine from './programme-planning-daily-routine';

describe('ProgrammePlanningDailyRoutine', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgrammePlanningDailyRoutine />);
    expect(baseElement).toBeTruthy();
  });
});
