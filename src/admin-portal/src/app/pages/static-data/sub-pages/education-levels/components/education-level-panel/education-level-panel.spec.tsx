import { render } from '@testing-library/react';
import EducationLevelPanel from './education-level-panel';

describe('EducationLevelPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <EducationLevelPanel closeDialog={() => {}} />
    );
    expect(baseElement).toBeTruthy();
  });
});
