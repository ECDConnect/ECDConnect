import { render } from '@testing-library/react';
import TeamLeadPanelCreate from './team-lead-panel-creat';

describe('TeamLeadPanelCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <TeamLeadPanelCreate closeDialog={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
