import { render } from '@testing-library/react';

import Typography from './typography';

describe('Typography', () => {
  it('should render successfully', () => {
    const { baseElement, getByText } = render(
      <Typography type={'h1'} text={'Hello world'} color={'black'} />
    );

    const text = getByText('Hello world');
    expect(baseElement).toBeTruthy();
    expect(text).toBeDefined();
  });
});
