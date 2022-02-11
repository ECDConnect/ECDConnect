import { render } from '@testing-library/react';

import HeaderCard from './header-card';

describe('HeaderCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <HeaderCard slide={{ image: '', text: '', title: '' }} />
    );
    expect(baseElement).toBeTruthy();
  });
});
