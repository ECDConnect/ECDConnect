import { render } from '@testing-library/react';

import UserPanelCreate from './user-panel-create';

describe('UserPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserPanelCreate closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
