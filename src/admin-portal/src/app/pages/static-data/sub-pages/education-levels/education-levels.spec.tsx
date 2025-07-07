import { render } from '@testing-library/react';

import EducationLevelView from './education-levels';

describe('EducationLevelView', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EducationLevelView />);
    expect(baseElement).toBeTruthy();
  });
});
