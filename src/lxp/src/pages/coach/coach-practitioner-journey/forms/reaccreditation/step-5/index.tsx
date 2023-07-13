import { FormInput, Typography } from '@ecdlink/ui';
import { useState, ChangeEvent } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { classroomsSelectors } from '@/store/classroom';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';

export const step5ReAccreditationQuestion =
  'How many assistants will attend every session?';
export const step5ReAccreditationVisitSection = 'Programme details';

export const Step5ReAccreditation = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const { isOnline } = useOnlineStatus();

  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );

  const currentClassroomGroups = classroomGroups.filter(
    (item) => item?.userId === smartStarter?.userId
  );
  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      {
        visitSection: step5ReAccreditationVisitSection,
        questions: [{ answer: value, question: step5ReAccreditationQuestion }],
      },
    ]);

    if (value !== '') {
      setEnableButton?.(true);
    } else {
      setEnableButton?.(false);
    }
  };

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text={step5ReAccreditationVisitSection}
        color="textDark"
      />
      <div className="flex">
        <Typography
          type="h4"
          text="Programme type:"
          color="textDark"
          className="my-4"
        />
        <Typography
          type="h4"
          text={
            currentClassroomGroups?.[0]?.programmeType?.description ??
            'Not provided'
          }
          color={isOnline ? 'textDark' : 'errorMain'}
          className="my-4 ml-1 font-bold"
        />
      </div>
      <FormInput
        className="mt-2"
        label={step5ReAccreditationQuestion}
        subLabel="Any programme with more than 10 children must have an assistant."
        placeholder="e.g. 2"
        value={answer}
        onChange={onChange}
      />
    </div>
  );
};
