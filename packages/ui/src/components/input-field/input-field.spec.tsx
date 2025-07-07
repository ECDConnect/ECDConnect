import { render } from '@testing-library/react';

import InputField from './input-field';

describe('InputField', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <InputField
        id={'test'}
        type={'text'}
        name={'test'}
        required={false}
        preFillValue={'This is a pre-filled value'}
        placeHolder={'Test Placeholder'}
      ></InputField>
    );
    expect(baseElement).toBeTruthy();
  });
});
