import { render } from '@testing-library/react';

import UserAvatar from './user-avatar';

describe('Avatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <UserAvatar size={'xs'} color={'secondary'} text={'JK'} />
    );
    expect(baseElement).toBeTruthy();
  });
});
