import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { staticDataSelectors } from '@/store/static-data';
import { traineeSelectors, traineeThunkActions } from '@/store/trainee';
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
import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as BalloonsImg } from '../../../../../../../assets/balloons.svg';
import { format } from 'date-fns';
import { useAppDispatch } from '@/store';

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
  const appDispatch = useAppDispatch();
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const smartSpaceVisitId = timeline?.sSCoachVisitId;
  const visitNotes = useSelector(traineeSelectors.getCoachVisitDataNextSteps);
  const assistantsNumber = useSelector(
    traineeSelectors.getTraineeVisitDataAssitantsNumber
  );

  const visitProgrammeCapacityData = useSelector(
    traineeSelectors.getCoachVisitCapacity
  );

  const smartSpaceCapacity = visitProgrammeCapacityData?.[2]?.questionAnswer;
  const totalMetresSquaredAvailable =
    ((Number(visitProgrammeCapacityData?.[0]?.questionAnswer) / 100) *
      Number(visitProgrammeCapacityData?.[1]?.questionAnswer)) /
    100;
  const programData = useSelector(staticDataSelectors.getProgrammeTypes);
  const traineeProgrammeType = useSelector(
    traineeSelectors.getTraineeProgrammeType
  );
  const traineeProgrammeTypeObject = programData?.find(
    (item) => item?.id === traineeProgrammeType
  );
  const visitSmartSpaceAnswers = useSelector(
    traineeSelectors.getCoachSmartSpaceStandardsAnswers
  );
  const visitSmartSpaceFalseAnswers = visitSmartSpaceAnswers?.filter(
    (item) => item?.questionAnswer === 'false'
  );

  const visitProgrammeCovidStandards = useSelector(
    traineeSelectors.getCoachVisitDataCovidStandards
  );

  const visitProgrammeCovidStandardsFalseAnswers =
    visitProgrammeCovidStandards?.filter(
      (item) => item?.questionAnswer === 'false'
    );

  const visitProgrammeStandardsChecklist = useSelector(
    traineeSelectors.getCoachVisitDataStandardsChecklist
  );

  const visitProgrammeStandardsChecklistTrueAnswers =
    visitProgrammeStandardsChecklist?.filter(
      (item) => item?.questionAnswer === 'true'
    );

  const visitProgrammeStandardsChecklistFalseAnswers =
    visitProgrammeStandardsChecklist?.filter(
      (item) => item?.questionAnswer === 'false'
    );
  const visitProgrammeAdditionalStandardsChecklist = useSelector(
    traineeSelectors.getCoachSmartSpaceAdditionalStandardsAnswers
  );

  const visitAdditionalStandardsChecklistFalseAnswers =
    visitProgrammeAdditionalStandardsChecklist?.filter(
      (item) => item?.questionAnswer === 'false'
    );

  const programmeNotRunning = useMemo(
    () =>
      visitProgrammeStandardsChecklist?.every(
        (item) => item.questionAnswer === 'false'
      ),
    [visitProgrammeStandardsChecklist]
  );

  const fetchSmartSpaceVisitData = useCallback(async () => {
    await appDispatch(
      traineeThunkActions.getCoachSmartSpaceVisitData({
        visitId: smartSpaceVisitId,
      })
    );
  }, [appDispatch, smartSpaceVisitId]);

  useEffect(() => {
    fetchSmartSpaceVisitData();
  }, [fetchSmartSpaceVisitData]);

  const renderLicenceResponseCard = useMemo(() => {
    const notAwardedDate = new Date(timeline?.smartSpaceLicenseNotAwardedDate);
    const awardedDate = new Date(timeline?.smartSpaceLicenseDate);
    if (
      timeline?.smartSpaceLicenseNotAwardedDate &&
      !timeline?.smartSpaceLicenseDate
    ) {
      return (
        <Card className="bg-errorBg my-4 flex items-center gap-4 rounded-2xl p-4">
          <div>
            <BalloonsImg className="h-16 w-12" />
          </div>
          <div>
            <Typography
              type="h3"
              weight="bold"
              color="errorDark"
              text={'SmartSpace Licence not awarded'}
            />
            <Typography
              type="body"
              color="textMid"
              text={format(notAwardedDate, 'd LLLL yyyy')}
            />
          </div>
        </Card>
      );
    }

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
          <Typography
            type="body"
            color="textMid"
            text={format(awardedDate, 'd LLLL yyyy')}
          />
        </div>
      </Card>
    );
  }, [
    timeline?.smartSpaceLicenseDate,
    timeline?.smartSpaceLicenseNotAwardedDate,
  ]);

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

    if (visitProgrammeStandardsChecklistTrueAnswers?.length === 14) {
      return (
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`text-14 flex h-5 w-12 rounded-full bg-${getGroupColor(
                visitProgrammeStandardsChecklistTrueAnswers?.length as number
              )} items-center justify-center font-bold text-white`}
            >
              {`${visitProgrammeStandardsChecklistTrueAnswers?.length} / ${visitProgrammeStandardsChecklist?.length}`}
            </div>
            <Typography type="body" color="textDark" text={`standards met`} />
          </div>
          <Typography
            type="body"
            color="textDark"
            text={`${practitioner?.user?.firstName}'s programme met all of the SmartStart standards!`}
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
    }

    return (
      <div>
        <div className="flex items-center gap-2">
          <div
            className={`text-14 flex h-5 w-12 rounded-full bg-${getGroupColor(
              visitProgrammeStandardsChecklistTrueAnswers?.length as number
            )} items-center justify-center font-bold text-white`}
          >
            {`${visitProgrammeStandardsChecklistTrueAnswers?.length} / ${visitProgrammeStandardsChecklist?.length}`}
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
    visitProgrammeStandardsChecklist?.length,
    visitProgrammeStandardsChecklistFalseAnswers,
    visitProgrammeStandardsChecklistTrueAnswers?.length,
  ]);

  const renderStillWorkingOn = useMemo(() => {
    if (
      timeline?.smartSpaceLicenseStatus === 'SmartSpace Licence received' &&
      visitAdditionalStandardsChecklistFalseAnswers &&
      visitAdditionalStandardsChecklistFalseAnswers?.length > 0
    ) {
      return (
        <>
          <div>
            <Typography
              type="body"
              color="textDark"
              weight="bold"
              text={`${practitioner?.user?.firstName}  is still working on the following additional standards:`}
              className="mt-4"
            />
            {visitAdditionalStandardsChecklistFalseAnswers?.map(
              (item, index) => {
                return (
                  <Typography
                    type="body"
                    color="textMid"
                    text={`• ${item?.question}`}
                    key={index}
                  />
                );
              }
            )}
          </div>
          <Divider dividerType="dashed" className="my-4" />
        </>
      );
    }

    if (
      timeline?.smartSpaceLicenseStatus === 'SmartSpace Licence not received' &&
      visitSmartSpaceFalseAnswers &&
      visitSmartSpaceFalseAnswers?.length > 0
    ) {
      return (
        <>
          <div>
            <Typography
              type="body"
              color="textDark"
              weight="bold"
              text={`${practitioner?.user?.firstName}  is still working on the following SmartSpace standards:`}
              className="mt-4"
            />
            {visitSmartSpaceFalseAnswers?.map((item, index) => {
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
          <Divider dividerType="dashed" className="my-4" />
        </>
      );
    }
  }, [
    practitioner?.user?.firstName,
    timeline?.smartSpaceLicenseStatus,
    visitAdditionalStandardsChecklistFalseAnswers,
    visitSmartSpaceFalseAnswers,
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
      onBack={() => setNotificationStep('')}
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
        {/* {timeline?.smartSpaceLicenseStatus === "SmartSpace Licence received" && visitProgrammeAdditionalStandardsChecklist && visitProgrammeAdditionalStandardsChecklist?.length > 0 && 
        <>
        <div>
          <Typography
            type="body"
            color="textDark"
            weight="bold"
            text={`${practitioner?.user?.firstName}  is still working on the following additional standards:`}
            className="mt-4"
          />
          {visitProgrammeAdditionalStandardsChecklist?.map((item, index) => {
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
        <Divider dividerType="dashed" className="my-4" />
        </>
} */}
        {renderStillWorkingOn}
        <div className="flex flex-col gap-2">
          <Typography
            type="h4"
            color="textDark"
            text={'Your SmartSpace visit notes:'}
          />
          <Typography
            type="body"
            color="textMid"
            text={`• ${visitNotes?.questionAnswer}`}
          />
        </div>
        <Divider dividerType="dashed" className="my-4" />
        {!timeline?.smartSpaceLicenseNotAwardedDate && (
          <>
            <div className="flex flex-col gap-2">
              <Typography
                type="h4"
                color="textDark"
                text={'Programme capacity'}
              />
              <div className="flex items-center gap-2">
                <Typography
                  type="h4"
                  color="textMid"
                  text={`Programme type:`}
                />
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
                  {visitProgrammeCovidStandardsFalseAnswers?.map(
                    (item, index) => {
                      return (
                        <Typography
                          type="body"
                          color="textMid"
                          text={`• ${item?.question}`}
                          key={index}
                        />
                      );
                    }
                  )}
                </div>
              )}
            </div>
            <Divider dividerType="dashed" className="my-4" />
            <div className="flex flex-col gap-2">
              <Typography
                type="h4"
                color="textDark"
                text={'Standards checklist'}
              />
              {renderStandardsChecklist}
            </div>
          </>
        )}
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
