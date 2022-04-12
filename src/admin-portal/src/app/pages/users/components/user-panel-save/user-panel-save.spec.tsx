import { render } from '@testing-library/react';

import UserPanelSave from './user-panel-save';

describe('UserPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <UserPanelSave disabled={false} onSave={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
