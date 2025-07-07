import { render } from '@testing-library/react';

import HeaderSlider, { HeaderSliderProps } from './header-slider';

describe('HeaderSlider', () => {
  it('should render all cards that is passed', () => {
    const props: HeaderSliderProps = {
      slides: [
        {
          image: '',
          status: 1,
          title: 'title',
          text: 'text',
        },
        {
          image: '',
          status: 1,
          title: 'title',
          text: 'text',
        },
      ],
    };

    const { getByTestId } = render(<HeaderSlider {...props} />);

    const firstCard = getByTestId('header-slide-0');
    const lastCard = getByTestId('header-slide-1');

    expect(firstCard).toBeDefined();
    expect(lastCard).toBeDefined();
  });
});
