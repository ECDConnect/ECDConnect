import { render } from '@testing-library/react';
import RelationPanel from './relation-panel';

describe('RelationPanel', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RelationPanel closeDialog={() => {}} />);
    expect(baseElement).toBeTruthy();
  });
});
