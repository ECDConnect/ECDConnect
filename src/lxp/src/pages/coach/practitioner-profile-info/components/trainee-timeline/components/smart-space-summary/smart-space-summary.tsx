import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { staticDataSelectors } from '@/store/static-data';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerDto } from '@ecdlink/core';
import { BannerWrapper, Card, Divider, Typography } from '@ecdlink/ui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

interface SmartSpaceSummaryProps {
  practitioner: PractitionerDto;
  setNotificationStep: (item: string) => void;
}

export const SmartSpaceSummary: React.FC<SmartSpaceSummaryProps> = ({
  practitioner,
  setNotificationStep,
}) => {
  const smartSpaceVisitData = useSelector(
    traineeSelectors.getCoachSmartSpaceVisitData
  );
  const { isOnline } = useOnlineStatus();
  const visitNotes = useSelector(traineeSelectors.getCoachVisitDataNextSteps);
  const assistantsNumber = useSelector(
    traineeSelectors.getTraineeVisitDataAssitantsNumber
  );
  const visitProgrammeCapacityData = useSelector(
    traineeSelectors.getCoachVisitCapacity
  );
  const smartSpaceCapacity = visitProgrammeCapacityData?.[2]?.answer;
  const totalMetresSquaredAvailable =
    ((Number(visitProgrammeCapacityData?.[0].answer) / 100) *
      Number(visitProgrammeCapacityData?.[1].answer)) /
    100;
  const programData = useSelector(staticDataSelectors.getProgrammeTypes);
  const traineeProgrammeType = useSelector(
    traineeSelectors.getTraineeProgrammeType
  );
  const traineeProgrammeTypeObject = programData?.find(
    (item) => item?.id === traineeProgrammeType
  );
  console.log({ totalMetresSquaredAvailable });
  console.log({ totalMetresSquaredAvailable });
  console.log({ visitNotes });
  console.log({ smartSpaceVisitData });

  const renderLicenceResponseCard = useMemo(() => {
    return (
      <Card className="bg-successBg my-4 flex rounded-2xl p-4">
        <div></div>
        <div>
          <Typography
            type="h3"
            weight="bold"
            color="successDark"
            text={'SmartSpace Licence awarded'}
          />
          <Typography type="body" color="textMid" text={'13 Demember 2023'} />
        </div>
      </Card>
    );
  }, []);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'SmartSpace Summary'}
      subTitle={
        practitioner?.user?.fullName ||
        `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`
      }
      color={'primary'}
      onBack={() => () => setNotificationStep('')}
      displayOffline={!isOnline}
      renderOverflow={true}
      className="h-screen"
    >
      <div className="p-4">
        <Typography type="h2" color="textDark" text={'SmartSpace summary'} />
        <Typography
          type="h4"
          color="textMid"
          weight="bold"
          text={practitioner?.user?.fullName || practitioner?.user?.firstName}
        />
        {renderLicenceResponseCard}
        <Divider dividerType="dashed" className="my-4" />
        <div className="flex flex-col gap-2">
          <Typography
            type="h4"
            color="textDark"
            text={'Your SmartSpace visit notes:'}
          />
          <Typography type="body" color="textMid" text={`• ${visitNotes}`} />
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className="flex flex-col gap-2">
          <Typography type="h4" color="textDark" text={'Programme capacity'} />
          <div className="flex items-center gap-2">
            <Typography type="h4" color="textMid" text={`Programme type:`} />
            <Typography
              type="h4"
              color="primary"
              text={traineeProgrammeTypeObject?.description || ''}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography
              type="h4"
              color="textMid"
              text={`Total metres squared available:`}
            />
            <Typography
              type="h4"
              color="primary"
              text={String(totalMetresSquaredAvailable)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography type="h4" color="textMid" text={`Assistants:`} />
            <Typography
              type="h4"
              color="primary"
              text={String(assistantsNumber)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Typography type="h4" color="textMid" text={`Capacity:`} />
            <Typography
              type="h4"
              color="primary"
              text={String(smartSpaceCapacity)}
            />
          </div>
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className="flex flex-col gap-2">
          <Typography type="h4" color="textDark" text={'COVID standards'} />
          <Typography type="body" color="textMid" text={`• ${visitNotes}`} />
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className="flex flex-col gap-2">
          <Typography type="h4" color="textDark" text={'Standards checklist'} />
          <Typography type="body" color="textMid" text={`• ${visitNotes}`} />
        </div>
      </div>
    </BannerWrapper>
  );
};
