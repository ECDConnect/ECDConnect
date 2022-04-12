import { render } from '@testing-library/react';

import TitleListItem from './title-list-item';

describe('TitleListItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TitleListItem item={{} as any} />);
    expect(baseElement).toBeTruthy();
  });
});
