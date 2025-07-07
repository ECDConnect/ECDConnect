import { render } from '@testing-library/react';

import { Dialog } from './dialog';
import { DialogPosition } from './models/DialogPosition';

describe('Dialog', () => {
  it('should render successfully', () => {
    const { baseElement, getByTestId } = render(
      <Dialog visible position={DialogPosition.Middle}>
        <div data-testid="dialog-content">Content</div>
      </Dialog>
    );
    const dialogWrapper = getByTestId('dialog-wrapper');
    const dialogContent = getByTestId('dialog-content');
    expect(baseElement).toBeTruthy();
    expect(dialogWrapper).toBeDefined();
    expect(dialogContent).toBeDefined();
  });
});
