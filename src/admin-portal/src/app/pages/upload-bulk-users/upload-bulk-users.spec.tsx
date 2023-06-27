import { render } from '@testing-library/react';

import UploadBulkUser from './upload-bulk-users';

describe('UploadBulkUser', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UploadBulkUser />);
    expect(baseElement).toBeTruthy();
  });
});
