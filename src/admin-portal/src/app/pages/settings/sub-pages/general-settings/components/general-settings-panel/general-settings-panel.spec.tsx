import { render } from '@testing-library/react';
import GeneralSettingsPanel from './general-settings-panel';

describe('GeneralSettingsPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <GeneralSettingsPanel closeDialog={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
