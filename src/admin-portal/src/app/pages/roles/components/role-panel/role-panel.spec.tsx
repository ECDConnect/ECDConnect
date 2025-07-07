import { render } from '@testing-library/react';
import RolePanel from './role-panel';

describe('RolePanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RolePanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
