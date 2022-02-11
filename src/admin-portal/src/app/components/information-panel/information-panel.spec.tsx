import { render } from '@testing-library/react';
import InformationPanel from './information-panel';

describe('InformationPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InformationPanel />);
    expect(baseElement).toBeTruthy();
  });
});
