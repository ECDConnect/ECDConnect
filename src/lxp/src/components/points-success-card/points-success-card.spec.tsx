import { render, screen } from '@testing-library/react';

import { PointsSuccessCard } from './points-success-card';

describe('PointsSuccessCard', () => {
  it('should render the success message when visible', () => {
    const message = 'Good job! All your attendance registers are up to date!';

    render(
      <PointsSuccessCard
        className={'w-full'}
        visible
        message={message}
        icon={'SparklesIcon'}
      />
    );

    expect(screen.getByText(message)).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const message = 'Good job! All your attendance registers are up to date!';

    render(
      <PointsSuccessCard
        className={'w-full'}
        visible={false}
        message={message}
        icon={'SparklesIcon'}
      />
    );

    expect(screen.queryByText(message)).toBeNull();
  });
});
