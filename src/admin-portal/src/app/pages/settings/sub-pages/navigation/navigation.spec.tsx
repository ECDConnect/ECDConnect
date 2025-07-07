import { render } from '@testing-library/react';

import GeneralSettingsView from './general-settings';

describe('GeneralSettingsView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GeneralSettingsView />);
    expect(baseElement).toBeTruthy();
  });
});
