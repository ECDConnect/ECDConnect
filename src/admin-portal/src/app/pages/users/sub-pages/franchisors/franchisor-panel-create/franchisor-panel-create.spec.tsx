import { render } from '@testing-library/react';

import FranchisorPanelCreate from './franchisor-panel-create';

describe('FranchisorPanelCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <FranchisorPanelCreate closeDialog={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
