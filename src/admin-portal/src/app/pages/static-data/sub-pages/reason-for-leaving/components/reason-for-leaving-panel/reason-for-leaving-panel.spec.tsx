import { render } from '@testing-library/react';
import ReasonForLeavingPanel from './reason-for-leaving-panel';

describe('ReasonForLeavingPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ReasonForLeavingPanel closeDialog={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
