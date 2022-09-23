import {
  FormComponentProps,
  PractitionerDto,
  practitionerSchema,
} from '@ecdlink/core';
import { Divider, Dropdown, FormInput, Typography, Button } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  childBasicInfoFormSchema,
  ChildBasicInfoModel,
} from '@schemas/child/child-registration/child-basic-info';
import { classroomsSelectors } from '@store/classroom';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { practitionerSelectors } from '@/store/practitioner';

export const ChildBasicInfo: React.FC<
  FormComponentProps<ChildBasicInfoModel>
> = ({ onSubmit }) => {
  const classrooms = useSelector(classroomsSelectors.getClassroomGroups);
  const classroomsForPractitioner = useSelector(
    classroomsSelectors.getClassroom
  );
  const [
    classroomsForPractitionerAnyType,
    setClassroomsForPractitionerAnyType,
  ] = useState<any>([]);

  const isPlaygroup = useSelector(classroomsSelectors.isPlaygroup());
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const { getValues, setValue, register, formState } =
    useForm<ChildBasicInfoModel>({
      resolver: yupResolver(childBasicInfoFormSchema),
      mode: 'onBlur',
      defaultValues: {},
    });

  useEffect(() => {
    if (classroomsForPractitioner) {
      setClassroomsForPractitionerAnyType([classroomsForPractitioner]);
    }
  }, [classroomsForPractitioner]);

  useEffect(() => {
    if (classrooms && classrooms.length > 0) {
      const defaultPlaygroup =
        classrooms.find((c) => c.name === NoPlaygroupClassroomType.name)?.id ||
        (classrooms[0].id ?? '');
      setValue('playgroupId', defaultPlaygroup, { shouldValidate: true });
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
    <div className="bg-white p-4 flex flex-col h-full w-full">
      <Typography type="h2" color="textDark" text="Child" />
      <Typography type={'h4'} text="Basic details" color={'textMid'} />

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

      <Dropdown<string>
        fullWidth
        className="mt-4"
        label="Which class will the child attend?"
        placeholder="Select class"
        selectedValue={getSelectedClassroom()}
        list={
          practitioner?.isPrincipal !== true &&
          classroomsForPractitionerAnyType.length > 0
            ? classroomsForPractitionerAnyType.map((x: any) => ({
                label: x.name,
                value: x.id || '',
              }))
            : classrooms.map((x) => ({ label: x.name, value: x.id || '' }))
        }
        onChange={(classroomId: string) => {
          setValue('playgroupId', classroomId, { shouldValidate: true });
        }}
      />

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
