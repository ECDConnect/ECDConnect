import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { staticDataSelectors } from '@/store/static-data';
import { traineeSelectors } from '@/store/trainee';
import { PractitionerDto } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Card,
  Colours,
  Divider,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as BalloonsImg } from '../../../../../../../assets/balloons.svg';
interface SmartSpaceSummaryProps {
  practitioner: PractitionerDto;
  setNotificationStep: (item: string) => void;
}

export const getGroupColor = (count: number): Colours => {
  if (count === 0) {
    return 'errorMain';
  }

  if (count < 12) {
    return 'alertMain';
  }

  return 'successMain';
};

export const SmartSpaceSummary: React.FC<SmartSpaceSummaryProps> = ({
  practitioner,
  setNotificationStep,
}) => {
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
  const visitProgrammeCovidStandards = useSelector(
    traineeSelectors.getCoachVisitDataCovidStandards
  );
  const visitProgrammeCovidStandardsFalseAnswers =
    visitProgrammeCovidStandards?.questions?.filter(
      (item) => item?.answer === false || item?.answer === 'false'
    );

  const visitProgrammeStandardsChecklist = useSelector(
    traineeSelectors.getCoachVisitDataStandardsChecklist
  );
  const visitProgrammeStandardsChecklistTrueAnswers =
    visitProgrammeStandardsChecklist?.questions?.filter(
      (item) => item?.answer === true || item?.answer === 'true'
    );
  const visitProgrammeStandardsChecklistFalseAnswers =
    visitProgrammeStandardsChecklist?.questions?.filter(
      (item) => item?.answer === false || item?.answer === 'false'
    );
  const programmeNotRunning = useMemo(
    () =>
      visitProgrammeStandardsChecklist?.questions.every(
        (item) => item.answer === false || item.answer === 'false'
      ),
    [visitProgrammeStandardsChecklist?.questions]
  );

  const renderLicenceResponseCard = useMemo(() => {
    return (
      <Card className="bg-successBg my-4 flex items-center gap-4 rounded-2xl p-4">
        <div>
          <BalloonsImg className="h-16 w-12" />
        </div>
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

  const renderStandardsChecklist = useMemo(() => {
    if (programmeNotRunning) {
      return (
        <Typography
          type="body"
          color="textMid"
          text={`${practitioner?.user?.firstName}'s programme was not running on the day of the SmartSpace visit.`}
        />
      );
    }

    return (
      <div>
        <div className="flex items-center gap-2">
          <div
            className={`text-14 flex h-5 w-12 rounded-full bg-${getGroupColor(
              visitProgrammeStandardsChecklistTrueAnswers?.length as number
            )} items-center justify-center font-bold text-white`}
          >
            {`${visitProgrammeStandardsChecklistTrueAnswers?.length} / ${visitProgrammeStandardsChecklist?.questions?.length}`}
          </div>
          <Typography type="body" color="textDark" text={`standards met`} />
        </div>
        <Typography
          type="body"
          color="textDark"
          weight="bold"
          text={`${practitioner?.user?.firstName} is still working on the following standards:`}
          className="mt-4"
        />
        {visitProgrammeStandardsChecklistFalseAnswers?.map((item, index) => {
          return (
            <Typography
              type="body"
              color="textMid"
              text={`• ${item?.question}`}
              key={index}
            />
          );
        })}
      </div>
    );
  }, [
    practitioner?.user?.firstName,
    programmeNotRunning,
    visitProgrammeStandardsChecklist?.questions?.length,
    visitProgrammeStandardsChecklistFalseAnswers,
    visitProgrammeStandardsChecklistTrueAnswers?.length,
  ]);

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
          {visitProgrammeCovidStandardsFalseAnswers?.length === 0 ? (
            <Typography
              type="body"
              weight="bold"
              color="textMid"
              text={`${practitioner?.user?.firstName} checked all of the COVID checklist boxes.`}
            />
          ) : (
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${practitioner?.user?.firstName} still needs to meet the following standards:`}
              />
              {visitProgrammeCovidStandardsFalseAnswers?.map((item, index) => {
                return (
                  <Typography
                    type="body"
                    color="textMid"
                    text={`• ${item?.question}`}
                    key={index}
                  />
                );
              })}
            </div>
          )}
        </div>
        <Divider dividerType="dashed" className="my-4" />
        <div className="flex flex-col gap-2">
          <Typography type="h4" color="textDark" text={'Standards checklist'} />
          {renderStandardsChecklist}
        </div>
        <Button
          type="filled"
          color="primary"
          className="mt-8 mb-4 w-full rounded-2xl"
          onClick={() => {
            setNotificationStep('');
          }}
        >
          {renderIcon('XIcon', 'mr-2 text-white w-5')}
          <Typography type={'body'} text={'Close'} color={'white'} />
        </Button>
      </div>
    </BannerWrapper>
  );
};
