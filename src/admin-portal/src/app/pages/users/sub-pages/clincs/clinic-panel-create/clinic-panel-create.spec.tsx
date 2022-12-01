import { render } from '@testing-library/react';

import ClinicPanelCreate from './clinic-panel-create';

describe('ClinicPanelCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ClinicPanelCreate closeDialog={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
