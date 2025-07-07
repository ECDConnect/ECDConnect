import { render } from '@testing-library/react';
import { TabItem } from './models/TabItem';

import TabList from './tab-list';

describe('TabsComponent', () => {
  it('should render successfully', () => {
    const tabItems = [
      {
        title: 'Attendance',
        initActive: false,
        child: <div>Attendance Coming Soon</div>,
      } as TabItem,
      {
        title: 'Children',
        initActive: false,
        child: <div>Children Coming Soon</div>,
      } as TabItem,
      { title: 'Programme', initActive: true } as TabItem,
      { title: 'Resources', initActive: false } as TabItem,
      { title: 'Settings', initActive: false } as TabItem,
    ];

    const { baseElement } = render(<TabList tabItems={tabItems} />);
    expect(baseElement).toBeTruthy();
  });
});
