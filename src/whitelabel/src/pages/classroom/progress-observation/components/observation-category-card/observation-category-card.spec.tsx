import { render } from '@testing-library/react';

import ObservationCategoryCard from './observation-category-card';

describe('ObservationCategoryCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ObservationCategoryCard
        helpingSkillId={1}
        categoryName={'Speaking, listening & communicating'}
        categoryColour={'primary'}
        childName={'Themba'}
        toDoNote={'I will throw a ball to Themba every morning'}
        onEdit={() => {}}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
