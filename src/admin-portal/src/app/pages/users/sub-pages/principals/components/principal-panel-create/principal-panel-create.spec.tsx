import { render } from '@testing-library/react';

import PractitionerPanelCreate from './practitioner-panel-create';

describe('PractitionerPanelCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PractitionerPanelCreate closeDialog={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
