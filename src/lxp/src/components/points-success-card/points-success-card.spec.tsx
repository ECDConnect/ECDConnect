import { render } from '@testing-library/react';

import { PointsSuccessCard } from './points-success-card';

describe('PointsSuccessCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PointsSuccessCard
        className={'w-full'}
        message={'What can you do with SmartStart points?'}
        icon={'GiftIcon'}
        points={100}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
