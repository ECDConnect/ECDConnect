import { render } from '@testing-library/react';

import HealthCareWorkerPanelCreate from './health-care-worker-panel-create';

describe('HealthCareWorkerPanelCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <HealthCareWorkerPanelCreate closeDialog={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
