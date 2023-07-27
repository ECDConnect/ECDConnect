import { PractitionerDto } from '@ecdlink/core';
import { Button, Typography, renderIcon } from '@ecdlink/ui';

interface CoachSelfAssessment1Props {
  practitioner: PractitionerDto;
  handleNextSection: () => void;
  // programmeName: string | undefined | null;
  // setSectionQuestions: (value?: SectionQuestions[]) => void;
  // saveFranchisorAgreementData: () => void;
}

export const CoachSelfAssessment1: React.FC<CoachSelfAssessment1Props> = ({
  practitioner,
  handleNextSection,
}) => {
  return (
    <div className="p-4">
      <Typography
        type={'h2'}
        text={`Discuss the self-assessment form`}
        color={'textDark'}
        className={'my-3'}
      />
      <Typography
        type={'body'}
        text={`Help ${
          practitioner?.user?.firstName || ''
        } prepare for the PQA visit. Show her the self-assessment form (Q4) on your phone or give her a paper copy. Tap 'See self-assessment form' below to view it on your phone now.`}
        color={'textMid'}
        className={'my-3'}
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
              <Typography
                type={'help'}
                text={'See self-assessment form'}
                color={'white'}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div>
            <Button
              type="outlined"
              color="primary"
              className="mt-1 mb-2 w-full"
              onClick={() => {}}
            >
              {renderIcon('DownloadIcon', 'mr-2 text-white w-5 bg-primary')}
              <Typography
                type={'help'}
                text={'Save & exit'}
                color={'primary'}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
