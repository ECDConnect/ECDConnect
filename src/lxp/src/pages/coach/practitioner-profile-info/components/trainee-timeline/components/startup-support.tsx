import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerDto } from '@ecdlink/core';
import { BannerWrapper, Typography, renderIcon } from '@ecdlink/ui';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { dateOptions } from '../timeline-steps';
import { staticDataSelectors } from '@/store/static-data';

interface StartupSupportDetailsProps {
  practitioner: PractitionerDto | undefined;
  setNotificationStep: any;
}

export const StartupSupportDetails: React.FC<StartupSupportDetailsProps> = ({
  practitioner,
  setNotificationStep,
}) => {
  const { isOnline } = useOnlineStatus();
  const programData = useSelector(staticDataSelectors.getProgrammeTypes);
  const traineeTimeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline
  );
  const traineeVisitData = useSelector(traineeSelectors.getTraineeVisitData);

  const programmeTypeQuestionObject = traineeVisitData?.find(
    (item) =>
      item?.question ===
      ' What type of programme are you running or planning to run?'
  );
  const programme = programData?.find(
    (item) => item?.id === programmeTypeQuestionObject?.questionAnswer
  );

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      showBackground={false}
      color={'primary'}
      title={'Start-up support agreement'}
      subTitle={practitioner?.user?.fullName}
      backgroundColour={'uiBg'}
      displayOffline={!isOnline}
      onBack={() => setNotificationStep('')}
    >
      <div className="p-4">
        <Typography
          className={'mt-3 mb-8'}
          color={'textDark'}
          type={'h2'}
          text={'Start-up support agreement details'}
        />
        <div className="mb-3">
          <Typography
            className={'my-1'}
            color={'textMid'}
            type={'body'}
            text={'Agreement signed on'}
          />
          <div className="flex items-center gap-2">
            <div className="bg-successMain flex h-5 w-5 items-center justify-center rounded-full">
              {renderIcon('CheckIcon', ' h-4 w-4 text-white')}
            </div>
            <Typography
              className={'my-1'}
              color={'textMid'}
              type={'body'}
              text={new Date(
                traineeTimeline?.signStartUpSupportAgreementDate
              ).toLocaleDateString('en-ZA', dateOptions)}
            />
          </div>
        </div>
        <div className="mb-3">
          <Typography
            className={'my-1'}
            color={'textMid'}
            type={'body'}
            text={'Programme type'}
          />
          <div className="flex items-center gap-2">
            <Typography
              className={'my-1'}
              color={'textMid'}
              type={'body'}
              text={programme?.description}
            />
          </div>
        </div>
        <div className="mb-3">
          <Typography
            className={'my-1'}
            color={'textMid'}
            type={'body'}
            text={'Start-up support provider'}
          />
          <div className="flex items-center gap-2">
            <Typography
              className={'my-1'}
              color={'textMid'}
              type={'body'}
              text={new Date(
                traineeTimeline?.signStartUpSupportAgreementDate
              ).toLocaleDateString('en-ZA', dateOptions)}
            />
          </div>
        </div>
        <div className="mb-3">
          <Typography
            className={'my-1'}
            color={'textMid'}
            type={'body'}
            text={'Monthly start-up support amount'}
          />
          <div className="flex items-center gap-2">
            <Typography
              className={'my-1'}
              color={'textMid'}
              type={'body'}
              text={new Date(
                traineeTimeline?.signStartUpSupportAgreementDate
              ).toLocaleDateString('en-ZA', dateOptions)}
            />
          </div>
        </div>
        <div>
          <Typography
            className={'my-1'}
            color={'textMid'}
            type={'body'}
            text={'Payment start and end dates'}
          />
          <div className="flex items-center gap-2">
            <Typography
              className={'my-1'}
              color={'textMid'}
              type={'body'}
              text={new Date(
                traineeTimeline?.signStartUpSupportAgreementDate
              ).toLocaleDateString('en-ZA', dateOptions)}
            />
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};
