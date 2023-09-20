import { PractitionerDto } from '@ecdlink/core';
import { Alert } from '@ecdlink/ui';

interface SelfAssessmentAlertProps {
  practitioner: PractitionerDto;
}

export const SelfAssessmentAlert: React.FC<SelfAssessmentAlertProps> = ({
  practitioner,
}) => {
  return (
    <Alert
      type={'warning'}
      title={'You are viewing this form and cannot fill in responses.'}
      list={[
        `Discuss the self-assessment form with ${practitioner?.user?.firstName}.`,
      ]}
      className="mt-4 mb-2"
    />
  );
};
