import { render } from '@testing-library/react';

import ChildPanelCreate from './child-panel-create';

describe('ChildPanelCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ChildPanelCreate closeDialog={() => null} />
    );
    expect(baseElement).toBeTruthy();
  });
});
