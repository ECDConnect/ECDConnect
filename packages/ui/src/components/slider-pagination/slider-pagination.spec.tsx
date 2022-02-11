import { render } from '@testing-library/react';
import SliderPagination from './slider-pagination';

describe('SliderPagination', () => {
  it('should render successfully', () => {
    const totalItems = 3;
    const { baseElement, getByTestId } = render(
      <SliderPagination totalItems={3} activeIndex={1} />
    );

    for (let i = 0; i < totalItems; i++) {
      const paginationItem = getByTestId(`pagination-item-${i}`);
      expect(paginationItem).toBeDefined();
    }

    expect(baseElement).toBeTruthy();
  });
});
