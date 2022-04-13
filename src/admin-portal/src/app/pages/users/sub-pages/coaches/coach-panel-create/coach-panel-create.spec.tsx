import { render } from '@testing-library/react';

import CoachPanelCreate from './coach-panel-create';

describe('CoachPanelCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <CoachPanelCreate closeDialog={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
