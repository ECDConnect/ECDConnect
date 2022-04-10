import { FormComponentProps } from '@ecdlink/core';
import { Divider, Dropdown, FormInput, Typography, Button } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  childBasicInfoFormSchema,
  ChildBasicInfoModel,
} from '@schemas/child/child-registration/child-basic-info';
import { classroomsSelectors } from '../../../../store/classroom';

export const ChildBasicInfo: React.FC<FormComponentProps<ChildBasicInfoModel>> = ({ onSubmit }) => {
  const classrooms = useSelector(classroomsSelectors.getClassroomGroups);
  const isPlaygroup = useSelector(classroomsSelectors.isPlaygroup());

  const { getValues, setValue, register, formState } = useForm<ChildBasicInfoModel>({
    resolver: yupResolver(childBasicInfoFormSchema),
    mode: 'onBlur',
    defaultValues: {},
  });

  useEffect(() => {
    if (classrooms && classrooms.length > 0) {
      setValue('playgroupId', classrooms[0].id ?? '', { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classrooms]);

  const onNext = (formValue: ChildBasicInfoModel) => {
    onSubmit(formValue);
  };

  const getSelectedClassroom = (): string => {
    const values = getValues();

    return values.playgroupId ?? '';
  };

  return (
    <div className="bg-uiBg p-4 flex flex-col h-full w-full">
      <Typography type="h1" color="primary" text="Child" />
      <Typography type={'h2'} text="Basic details" color={'textMid'} />

      <FormInput<ChildBasicInfoModel>
        className="mt-4"
        register={register}
        nameProp="firstName"
        label="First name"
        placeholder="First name"
      />
      <FormInput<ChildBasicInfoModel>
        className="mt-4"
        register={register}
        nameProp="surname"
        label="Surname"
        placeholder="Surname/Family name"
      />
      {isPlaygroup && (
        <Dropdown<string>
          fullWidth
          className="mt-4"
          label="Which playgroup will the child attend?"
          placeholder="Select playgroup"
          selectedValue={getSelectedClassroom()}
          list={classrooms.map((x) => ({ label: x.name, value: x.id || '' }))}
          onChange={(classroomId: string) => {
            setValue('playgroupId', classroomId, { shouldValidate: true });
          }}
        />
      )}

      <Divider dividerType="solid" className="my-3" />
      <Button
        text="Next"
        icon="ArrowCircleRightIcon"
        iconPosition="start"
        disabled={!formState.isValid}
        type="filled"
        color="primary"
        textColor="white"
        onClick={() => {
          onNext(getValues());
        }}
      />
    </div>
  );
};
