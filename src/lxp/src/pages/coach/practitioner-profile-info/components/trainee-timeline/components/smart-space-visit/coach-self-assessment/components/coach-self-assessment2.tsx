import { PractitionerDto } from '@ecdlink/core';
import { Alert, Button, Typography, renderIcon } from '@ecdlink/ui';
import { SelfAssessmentAlert } from './self-assessment-alert/self-assessment-alert';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { format } from 'date-fns';

interface CoachSelfAssessment1Props {
  practitioner: PractitionerDto;
  handleNextSection: () => void;
}

export const CoachSelfAssessment2: React.FC<CoachSelfAssessment1Props> = ({
  practitioner,
  handleNextSection,
}) => {
  const practitionerUserId = practitioner?.userId;
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerUserId!)
  );

  const [uncompletedSelfAssessment] = timeline?.selfAssessmentVisits ?? [];
  const dueDate = new Date(uncompletedSelfAssessment?.plannedVisitDate);

  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={`About the self assessment form`}
        color={'textDark'}
        className={'mt-3'}
      />
      {uncompletedSelfAssessment && dueDate && (
        <Typography
          type={'body'}
          text={
            dueDate
              ? `Due date: ${format(new Date(dueDate), 'dd MMM yyyy')}`
              : ``
          }
          color={'textMid'}
          className={'mb-3'}
        />
      )}

      <SelfAssessmentAlert practitioner={practitioner} />

      <Typography
        type={'h4'}
        text={`Your Club Coach will arrange a time to come and visit your programme.`}
        color={'textDark'}
        className={'mt-3'}
      />

      <Typography
        type={'body'}
        text={`The aim of the visit is to support you to deliver the SmartStart programme. The focus will be on your strengths and abilities, what you can do to build on them.

This form will help you think about which parts of your SmartStart training you are doing well and if there are any areas that need to get better.

This form must be completed before your coach’s visit. At the visit, your coach will talk to you about these answers, share ideas, and discuss ways to improve.
        `}
        color={'textMid'}
        className={'mt-4'}
      />

      <div className="mt-4 space-y-4">
        <div>
          <div>
            <Button
              type="filled"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {
                handleNextSection();
              }}
            >
              {renderIcon('ArrowCircleRightIcon', 'mr-2 text-white w-5')}
              <Typography type={'help'} text={'Next'} color={'white'} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
