import { render } from '@testing-library/react';
import { MenuListDataItem } from '../../../../models';

import MenuListItem from './menu-list-item';

describe('MenuListItem', () => {
  it('should render successfully', () => {
    const menuItem = {
      title: 'Test',
      subTitle: 'Test,Test',
      menuIcon: 'UserIcon',
    } as MenuListDataItem;
    const { baseElement } = render(<MenuListItem item={menuItem} />);
    expect(baseElement).toBeTruthy();
  });
});
