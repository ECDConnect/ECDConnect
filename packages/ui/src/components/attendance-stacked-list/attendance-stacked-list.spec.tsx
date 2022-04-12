import { render } from '@testing-library/react';

//@ts-ignore
import StackedList from './stacked-list';

describe('StackedList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StackedList />);
    expect(baseElement).toBeTruthy();
  });
});
