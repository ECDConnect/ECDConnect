import * as Yup from 'yup';
import { render } from '@testing-library/react';
import CheckboxCard from './checkbox-card';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export interface TestCheckModel {
  checked: boolean;
  desc: string;
}

export const initTest: TestCheckModel = { checked: true, desc: 'test' };

export const initTestSchema = Yup.object().shape({
  checked: Yup.boolean(),
});

describe('CheckboxCard', () => {
  it('should render successfully', () => {
    const { register: checkboxTestFormRegister } = useForm<TestCheckModel>({
      resolver: yupResolver(initTestSchema),
      mode: 'onChange',
      reValidateMode: 'onChange',
    });

    const { baseElement } = render(
      <CheckboxCard<TestCheckModel>
        register={checkboxTestFormRegister}
        nameProp={'checked'}
        description={'Shows attachment to other people'}
        checkboxColor={'tertiary'}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
