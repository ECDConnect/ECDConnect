import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { ClassroomGroup } from '@ecdlink/graphql';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';

export const Step2ReAccreditation = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<ClassroomGroup[]>();
  const [question, setAnswers] = useState({
    question: `SmartSpace check`,
    answer: [] as (string | number | undefined)[],
  });

  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);

  const answers = question.answer as string[];
  const name = smartStarter?.user?.firstName || 'the SmartStarter';
  const visitSection = 'Step 2';

  const getScore = (answers: string[]) => {
    const length = answers?.length;
    let scoreColours: Colours = 'errorMain';

    if (length > 0 && length < 17) {
      scoreColours = 'alertMain';
    }

    if (length === 17) {
      scoreColours = 'successMain';
    }

    return {
      score: length,
      color: scoreColours,
    };
  };

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        return setSectionQuestions?.([
          {
            visitSection: visitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        {
          visitSection: visitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, question, setSectionQuestions]
  );

  const classroomsDetailsForPractitioner = useCallback(async () => {
    const classroomDetails = (await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(
      smartStarter?.userId!
    )) as unknown;

    setPractitionerClassroomDetails(classroomDetails as ClassroomGroup[]);
    return classroomDetails;
  }, [smartStarter?.userId, userAuth?.auth_token]);

  useEffect(() => {
    classroomsDetailsForPractitioner();
    setEnableButton?.(true);
  }, [classroomsDetailsForPractitioner, setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text={`${name} - ${question.question}`} />
      <Typography
        type="h4"
        text={
          isOnline
            ? `${practitionerClassroomDetails?.[0]?.classroom?.name || ''} ${
                practitionerClassroomDetails?.[0]?.programmeType?.description ||
                ''
              }`
            : 'Not available offline'
        }
        color="textMid"
      />
      <Alert
        className="my-4"
        type="info"
        title={`Spend at least 10 minutes completing the SmartSpace checklist with ${name}`}
      />
      <Divider dividerType="dashed" />
      <div className="flex flex-col gap-2 py-4">
        {options.map((item) => (
          <CheckboxGroup
            checkboxColor="primary"
            titleWeight="normal"
            id={item}
            key={item}
            title={item}
            checked={answers?.some((option) => option === item)}
            value={item}
            onChange={onCheckboxChange}
          />
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2">
        <span
          className={`p-2 text-sm font-semibold text-white bg-${
            getScore(answers).color
          } rounded-15`}
        >
          {getScore(answers).score}/{17}
        </span>
        <Typography type="h4" text="Score" />
      </div>
    </div>
  );
};
