import { render } from '@testing-library/react';

import UserRoles from './user-roles';

describe('UserRoles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <UserRoles onUserRoleChange={() => null} roleList={[]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
