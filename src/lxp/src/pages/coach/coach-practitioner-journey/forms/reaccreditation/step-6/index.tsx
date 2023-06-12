import { FormInput, Typography } from '@ecdlink/ui';
import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { useParams } from 'react-router';
import { PractitionerJourneyParams } from '../../../coach-practitioner-journey.types';
import { useSelector } from 'react-redux';
import { ClassroomGroup } from '@ecdlink/graphql';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const Step5ReAccreditation = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const question = 'How many assistants will attend every session?';

  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<ClassroomGroup[]>();

  const visitSection = 'Programme details';

  const { isOnline } = useOnlineStatus();

  const { practitionerId } = useParams<PractitionerJourneyParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const userAuth = useSelector(authSelectors.getAuthUser);

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      { visitSection, questions: [{ answer, question }] },
    ]);

    if (value !== '') {
      setEnableButton?.(true);
    } else {
      setEnableButton?.(false);
    }
  };

  const classroomsDetailsForPractitioner = useCallback(async () => {
    const classroomDetails = (await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(
      practitioner?.userId!
    )) as unknown;

    setPractitionerClassroomDetails(classroomDetails as ClassroomGroup[]);
    return classroomDetails;
  }, [practitioner?.userId, userAuth?.auth_token]);

  useEffect(() => {
    classroomsDetailsForPractitioner();
  }, [classroomsDetailsForPractitioner]);

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
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
            isOnline
              ? practitionerClassroomDetails?.[0].programmeType?.description ||
                ''
              : 'You need to be online to view programme type'
          }
          color={isOnline ? 'textDark' : 'errorMain'}
          className="my-4 ml-1 font-bold"
        />
      </div>
      <FormInput
        className="mt-2"
        label={question}
        subLabel="Any programme with more than 10 children must have an assistant."
        placeholder="e.g. 2"
        value={answer}
        onChange={onChange}
      />
    </div>
  );
};
