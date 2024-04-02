import {
  Alert,
  Button,
  CheckboxChange,
  CheckboxGroup,
  Divider,
  LoadingSpinner,
  RoundIcon,
  Typography,
} from '@ecdlink/ui';
import { useWindowSize } from '@reach/window-size';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import Clipboard from '@/assets/clipboardIcon.svg';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useAppDispatch } from '@/store';
import {
  getInfantCurrentVisitSelector,
  getInfantById,
  getInfantNearestPreviousVisitByOrderDate,
} from '@/store/infant/infant.selectors';
import thumbsUpImage from '@/assets/thumbsUp.png';
import { infantSelectors, infantThunkActions } from '@/store/infant';
import {
  getStringFromClassNameOrId,
  toCamelCase,
  usePrevious,
} from '@ecdlink/core';
import { VisitDataStatus, VisitDataStatusFilterInput } from '@ecdlink/graphql';
import { ReactComponent as PollyImpressed } from '@/assets/celebrateIcon.svg';
import { format } from 'date-fns';
import ROUTES from '@/routes/routes';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { referralsSteps } from './walkthrough/steps';
import { useWalkthrough } from '@/context/walkthroughContext';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { InfantActions } from '@/store/infant/infant.actions';
import {
  notificationActions,
  notificationsSelectors,
} from '@/store/notifications';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { notificationTagConfig } from '@/constants/notifications';
import { Notification } from '@/store/notifications/notifications.types';

const HEADER_HEIGHT = 64;
interface GroupedData {
  [key: string]: VisitDataStatus[];
  clinicReferrals: VisitDataStatus[];
  departmentOfHomeAffairsReferrals: VisitDataStatus[];
  immunisationsSupplementsAndDeworming: VisitDataStatus[];
}

export interface InfantParams {
  id: string;
}

export const ReferralsTab: React.FC = () => {
  const { height } = useWindowSize();
  const history = useHistory();
  const location = useLocation();
  const appDispatch = useAppDispatch();

  const [showMarkAllButton] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isReferralsView, setIsReferralsView] = useState(true);
  const [isShowCompletedItems, setIsShowCompletedItems] = useState(false);
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  const { isLoading: isLoadingReferrals } = useThunkFetchCall(
    'visits',
    InfantActions.GET_REFERRALS_FOR_INFANT
  );
  const { isLoading: isLoadingCompletedReferrals } = useThunkFetchCall(
    'visits',
    InfantActions.GET_COMPLETED_REFERRALS_FOR_INFANT
  );
  const { isLoading: isLoadingUpdateVisitData } = useThunkFetchCall(
    'visits',
    InfantActions.UPDATE_VISIT_DATA_STATUS
  );

  const isLoading =
    isLoadingReferrals ||
    isLoadingCompletedReferrals ||
    isLoadingUpdateVisitData;

  const { walkthroughState, isWalkthroughSession, walkthroughDispatch } =
    useWalkthrough();

  const completedReferralsForInfant = useSelector(
    infantSelectors.getCompletedReferralsForInfantSelector
  );
  const referralsForInfant = useSelector(
    infantSelectors.getReferralsForInfantSelector
  );

  const { id: infantId } = useParams<InfantParams>();
  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const notifications = useSelector(notificationsSelectors.getAllNotifications);

  const currentVisit = useSelector((state: RootState) =>
    getInfantCurrentVisitSelector(state, '')
  );

  const redAlertNotifications = notifications?.filter(
    (item) =>
      item?.message?.cta?.includes(
        notificationTagConfig?.RedAlertReferralInfant.cta ?? ''
      ) && item?.message?.action?.includes(infantId)
  );

  const dangerSignsNotifications = notifications?.filter(
    (item) =>
      item?.message?.cta?.includes(
        notificationTagConfig?.DangerSignsReferral.cta ?? ''
      ) && item?.message?.action?.includes(infantId)
  );

  const growthIssuesNotifications = notifications?.filter(
    (item) =>
      item?.message?.cta?.includes(
        notificationTagConfig?.GrowthIssuesReferral.cta ?? ''
      ) && item?.message?.action?.includes(infantId)
  );

  const moderateChildMuacNotifications = notifications?.filter(
    (item) =>
      item?.message?.cta?.includes(
        notificationTagConfig?.ModerateChildMuacReferral.cta ?? ''
      ) && item?.message?.action?.includes(infantId)
  );

  const severeChildMuacNotifications = notifications?.filter(
    (item) =>
      item?.message?.cta?.includes(
        notificationTagConfig?.SevereChildMuacReferral.cta ?? ''
      ) && item?.message?.action?.includes(infantId)
  );

  const previousVisit = useSelector((state: RootState) =>
    getInfantNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const isToGetPreviousVisitStatusData =
    !currentVisit?.attended &&
    !currentVisit?.visitInProgress &&
    previousVisit?.id;

  const isWalkthrough =
    isWalkthroughSession && walkthroughState?.stepIndex !== 4;
  const wasWalkthrough = usePrevious(isWalkthrough);

  useEffect(() => {
    if (walkthroughState?.stepIndex === 4) {
      window.sessionStorage.clear();
      walkthroughDispatch?.({ type: 'SET_STEP', payload: 0 });
      return;
    }
  }, [walkthroughDispatch, walkthroughState?.stepIndex]);

  // Getting referrals for approval
  useLayoutEffect(() => {
    if (isToGetPreviousVisitStatusData) {
      appDispatch(
        infantThunkActions.getReferralsForInfant({
          infantId: infantId,
          visitId: previousVisit.id,
        })
      ).unwrap();
    } else if (currentVisit) {
      appDispatch(
        infantThunkActions.getReferralsForInfant({
          infantId: infantId,
          visitId: currentVisit.id,
        })
      ).unwrap();
    }
  }, [
    appDispatch,
    infantId,
    currentVisit,
    isToGetPreviousVisitStatusData,
    previousVisit,
  ]);

  // Getting referrals already approved
  useLayoutEffect(() => {
    if (isToGetPreviousVisitStatusData) {
      appDispatch(
        infantThunkActions.getCompletedReferralsForInfant({
          infantId: infantId,
          visitId: previousVisit.id,
        })
      ).unwrap();
    } else if (currentVisit) {
      appDispatch(
        infantThunkActions.getCompletedReferralsForInfant({
          infantId: infantId,
          visitId: currentVisit.id,
        })
      ).unwrap();
    }
  }, [
    appDispatch,
    infantId,
    currentVisit,
    isToGetPreviousVisitStatusData,
    previousVisit,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [referralsInput, setReferralsInput] =
    useState<VisitDataStatusFilterInput[]>();

  const removeNotifications = useCallback(
    (notifications: Notification[]) => {
      notifications.forEach((x) => {
        appDispatch(notificationActions.removeNotification(x!));
        appDispatch(
          disableBackendNotification({
            notificationId: x?.message?.reference ?? '',
          })
        );
      });
    },
    [appDispatch]
  );

  const handleSetReferrals = useCallback(
    (value: VisitDataStatusFilterInput[]) => {
      setReferralsInput((prevState) => {
        const newState = [...(prevState || [])];
        value.forEach((item) => {
          const index = newState.findIndex((element) => element.id === item.id);
          if (index !== -1) {
            newState[index].isCompleted = item.isCompleted;
          } else {
            newState.push(item);
          }
        });

        // setting the mark all done button visibility
        let _showCelebration = false;
        let totalCompleted = 0;
        for (const item of newState) {
          if (item.isCompleted) {
            totalCompleted++;
          }
        }

        if (totalCompleted === referralsForInfant?.length) {
          _showCelebration = true;
        }
        setShowCelebration(_showCelebration);

        // saving the new state for data status record
        if (newState.length > 0) {
          // appDispatch(infantActions.addInfantCompleteReferrals(newState));
          appDispatch(
            infantThunkActions.updateVisitDataStatus({ input: newState })
          ).unwrap();

          const removeDangerSignNotification = newState.find(
            (item) =>
              item.isCompleted &&
              String(item.comment).includes('was experiencing:')
          );

          if (dangerSignsNotifications && removeDangerSignNotification) {
            removeNotifications(dangerSignsNotifications);
          }

          const removeRedAlertNotification = newState.find(
            (item) =>
              item.isCompleted &&
              String(item.comment).includes(
                'was experiencing maternal distress'
              )
          );

          if (redAlertNotifications && removeRedAlertNotification) {
            removeNotifications(redAlertNotifications);
          }

          const removeGrowthIssueNotification = newState.find(
            (item) =>
              item.isCompleted &&
              (String(item.comment).includes('underweight') ||
                String(item.comment).includes('stunted'))
          );

          if (growthIssuesNotifications && removeGrowthIssueNotification) {
            removeNotifications(growthIssuesNotifications);
          }

          const removeModerateChildMuacNotifications = newState.find(
            (item) =>
              item.isCompleted &&
              String(item.comment).includes('Moderate acute malnutrition')
          );

          if (
            moderateChildMuacNotifications &&
            removeModerateChildMuacNotifications
          ) {
            removeNotifications(moderateChildMuacNotifications);
          }

          const removeSevereChildMuacNotifications = newState.find(
            (item) =>
              item.isCompleted &&
              String(item.comment).includes('Severe acute malnutrition')
          );

          if (
            severeChildMuacNotifications &&
            removeSevereChildMuacNotifications
          ) {
            removeNotifications(severeChildMuacNotifications);
          }
        }

        return newState;
      });
    },
    [
      appDispatch,
      dangerSignsNotifications,
      growthIssuesNotifications,
      moderateChildMuacNotifications,
      redAlertNotifications,
      referralsForInfant?.length,
      removeNotifications,
      severeChildMuacNotifications,
    ]
  );

  // group data under sections
  const groupedData = useMemo(() => {
    const groupedData = referralsForInfant?.reduce(
      (acc: { [key: string]: any }, currentValue) => {
        const section = toCamelCase(currentValue?.section || '');
        if (!section) return acc;
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push(currentValue);
        return acc;
      },
      {}
    );
    return groupedData;
  }, [referralsForInfant]) as GroupedData;

  const walkthroughData = {
    sections: [
      {
        label: 'Clinic referrals:',
        value: 'clinicReferrals',
      },
    ],
    questions: {
      clinicReferrals: [
        {
          id: '01',
          comment: 'MUAC is less than 22cm',
          isCompleted: false,
          insertedDate: new Date(),
        },
        {
          id: '02',
          comment: 'Immunisations and Vitamin A not up to date',
          isCompleted: false,
          insertedDate: new Date(),
        },
      ],
    },
    completedReferrals: [
      {
        id: '01',
        comment: 'MUAC is less than 22cm',
        isCompleted: false,
        insertedDate: new Date(),
      },
    ],
  };

  // all sections
  const sections = isWalkthrough
    ? walkthroughData.sections
    : groupedData &&
      Object.keys(groupedData)?.map((item) => ({
        label: groupedData[item][0].section,
        value: item,
      }));

  const [questions, setAnswers] = useState(groupedData);

  useEffect(() => {
    if (!wasWalkthrough && isWalkthrough) {
      return setAnswers(walkthroughData.questions as GroupedData);
    }

    if (isWalkthrough) return;
  }, [
    groupedData,
    questions,
    isWalkthrough,
    walkthroughData.questions,
    wasWalkthrough,
  ]);

  useEffect(() => {
    if (groupedData !== undefined) {
      return setAnswers(groupedData);
    }
  }, [groupedData]);

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedAnswers = currentQuestion?.map((question) => {
        if (question.id === value.id) {
          return value;
        }
        return question;
      });

      const updatedQuestions = { ...questions, [index]: updatedAnswers };
      const formattedQuestions = updatedAnswers.map((item) => {
        const { id, isCompleted, comment } = item;
        return { id, isCompleted, comment };
      });

      handleSetReferrals?.(formattedQuestions);
      setAnswers(updatedQuestions);
    },
    [handleSetReferrals, setAnswers, questions]
  );

  // change function for checkbox
  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      const referral = questions[event.name].find(
        (item) => item.comment === event.value
      );

      return onOptionSelected(
        { ...referral, isCompleted: event.checked },
        event.name
      );
    },
    [onOptionSelected, questions]
  );

  // Mark all referrals for client
  const onMarkAll = useCallback(() => {
    // Call setAnswers with a function to update the state
    setAnswers((prevState) => {
      // Create a copy of the previous state
      const updatedAnswers = { ...prevState };

      // Iterate through each section
      for (const section of sections) {
        const sectionIndex = section.value;
        const sectionQuestions = questions[sectionIndex];

        // Update all questions within the section, marking them as completed
        const updatedSectionQuestions = sectionQuestions.map((question) => ({
          ...question,
          isCompleted: true,
        }));

        // Update the answers with the new set of questions for this section
        updatedAnswers[sectionIndex] = updatedSectionQuestions;
      }

      const formattedQuestions = sections.flatMap((section) =>
        updatedAnswers[section.value].map((item) => ({
          id: item.id,
          isCompleted: item.isCompleted as any,
        }))
      );

      handleSetReferrals?.(formattedQuestions);

      return updatedAnswers;
    });
  }, [sections, handleSetReferrals, questions]);

  const onShowBackReferrals = useCallback(() => {
    if (isToGetPreviousVisitStatusData) {
      appDispatch(
        infantThunkActions.getCompletedReferralsForInfant({
          infantId: infantId,
          visitId: previousVisit.id,
        })
      ).unwrap();
    } else if (currentVisit) {
      appDispatch(
        infantThunkActions.getCompletedReferralsForInfant({
          infantId: infantId,
          visitId: currentVisit.id,
        })
      ).unwrap();
    }

    setIsReferralsView(false);
    if (completedReferralsForInfant) {
      for (const item of completedReferralsForInfant) {
        if (item.backReferralCompleted) {
          setShowCompletedButton(true);
          break;
        }
      }
    }
  }, [
    isToGetPreviousVisitStatusData,
    currentVisit,
    completedReferralsForInfant,
    appDispatch,
    infantId,
    previousVisit?.id,
  ]);

  const onShowReferrals = useCallback(() => {
    setIsReferralsView(true);
  }, []);

  const onUpdateBackReferral = useCallback(
    (id) => {
      history.push(`${location.pathname}/update-back-referral/${id}`, {
        activeTabIndex: ROUTES.CLIENTS.MOM_PROFILE.REFERRAL_TAB,
      });
    },
    [history, location]
  );

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor={'primary'}
        backgroundColor={'uiLight'}
        className="pt-20"
      />
    );
  }

  return (
    <div className="flex flex-col" style={{ height: height - HEADER_HEIGHT }}>
      {/* HEADING: REFERRALS -----------------------------------------*/}
      {isReferralsView && (
        <div className="bg-uiBg mt-14 flex items-center gap-2 p-4">
          <RoundIcon imageUrl={Clipboard} backgroundColor="tertiary" />
          <div>
            <Typography
              type="h2"
              align="left"
              weight="bold"
              color="textDark"
              text={`Referrals for ${infant?.user?.firstName || ''} `}
            />
            <Typography
              className="col-span-2 row-span-2"
              type="body"
              align="left"
              weight="skinny"
              text={`${referralsForInfant?.length} referrals`}
              color="textMid"
            />
          </div>
        </div>
      )}

      {/* HEADING: BACK-REFERRALS -----------------------------------------*/}
      {!isReferralsView && (
        <div className="bg-uiBg mt-14 flex items-center gap-2 p-4">
          <RoundIcon imageUrl={Clipboard} backgroundColor="tertiary" />
          <div>
            <Typography
              type="h2"
              align="left"
              weight="bold"
              color="textDark"
              text={`Back-referrals for ${infant?.user?.firstName || ''} & ${
                infant?.caregiver?.firstName
              } `}
            />
            <Typography
              className="col-span-2 row-span-2"
              type="body"
              align="left"
              weight="skinny"
              text={`${completedReferralsForInfant?.length} back-referrals to update`}
              color="textMid"
            />
          </div>
        </div>
      )}

      {/* BODY: REFERRALS -----------------------------------------*/}
      {((isReferralsView && referralsForInfant?.length !== 0) ||
        (isWalkthrough && walkthroughState?.stepIndex !== 2)) && (
        <div className="px-4 pb-4 pt-7">
          <Typography
            type="h4"
            align="left"
            weight="bold"
            text="Tap the boxes once you have made the referrals on paper"
            color="textDark"
            className="mb-4"
          />

          {showMarkAllButton && !showCelebration && (
            <Button
              text="Mark all as done"
              icon="CheckCircleIcon"
              type="filled"
              color="primary"
              textColor="white"
              className="mb-4 w-full"
              iconPosition="start"
              onClick={onMarkAll}
            />
          )}

          {sections &&
            sections?.map((section) => (
              <div className="flex flex-col gap-2" key={section?.value}>
                <Typography
                  type="h3"
                  text={section?.label || ''}
                  color="textDark"
                />
                {questions?.[section.value]?.map(
                  (item: VisitDataStatus, index) => (
                    <div
                      id={
                        index === 0
                          ? getStringFromClassNameOrId(referralsSteps[0].target)
                          : ''
                      }
                    >
                      <CheckboxGroup
                        id={item?.id}
                        key={item?.id}
                        title={item?.comment || ''}
                        titleColours="textMid"
                        checked={item?.isCompleted}
                        name={section?.value || ''}
                        value={item?.comment || ''}
                        description={format(
                          new Date(item.insertedDate),
                          'dd MMM yyyy'
                        )}
                        onChange={(event) => onCheckboxChange(event)}
                      />
                    </div>
                  )
                )}
              </div>
            ))}

          {/* Show success message when all referrals are selected */}
          {(showCelebration ||
            (isWalkthrough && walkthroughState?.stepIndex !== 2)) && (
            <>
              {!isWalkthrough && (
                <Alert
                  type="success"
                  className="mt-4"
                  messageColor="successDark"
                  variant="flat"
                  message={`Great job! You have made all referrals for ${
                    infant?.user?.firstName || ''
                  }`}
                  customIcon={
                    <div>
                      <PollyImpressed className="h-14 w-14" />
                    </div>
                  }
                />
              )}
              <Button
                id={getStringFromClassNameOrId(referralsSteps[1].target)}
                text="Manage back-referrals"
                icon="ClipboardCheckIcon"
                type="outlined"
                color="primary"
                textColor="primary"
                className="mt-4 w-full"
                iconPosition="start"
                onClick={onShowBackReferrals}
              />
            </>
          )}
        </div>
      )}

      {/* BODY: BACK-REFERRALS -----------------------------------------*/}
      {((!isReferralsView &&
        completedReferralsForInfant &&
        completedReferralsForInfant?.length > 0) ||
        (Number(walkthroughState?.stepIndex) >= 1 &&
          Number(walkthroughState?.stepIndex) < 3)) && (
        <div className="px-4 pb-4 pt-7">
          {(
            completedReferralsForInfant ||
            (walkthroughData.completedReferrals as VisitDataStatus[])
          )?.map((item: VisitDataStatus) => (
            <div key={item?.id}>
              {/* Not completed back referrals */}
              {!item.backReferralCompleted && (
                <>
                  <div
                    id={getStringFromClassNameOrId(referralsSteps[2].target)}
                    className="my-4 flex items-center justify-between gap-3"
                  >
                    <div
                      className="flex flex-col"
                      style={
                        isWalkthrough && walkthroughState?.stepIndex !== 2
                          ? { visibility: 'hidden' }
                          : {}
                      }
                    >
                      <Typography
                        type="markdown"
                        align="left"
                        weight="bold"
                        text={item?.comment || ''}
                        className="w-full"
                        color={'textDark'}
                      />
                      <Typography
                        type="body"
                        align="left"
                        weight="skinny"
                        text={`Referred on ${format(
                          new Date(item.insertedDate),
                          'dd MMM yyyy'
                        )}`}
                        color="textMid"
                        className="text-sm"
                      />
                    </div>

                    <Button
                      text="Update"
                      icon="PencilIcon"
                      type="filled"
                      color="secondaryAccent2"
                      textColor="secondary"
                      className={`h-10 w-28 ${
                        isWalkthrough && walkthroughState?.stepIndex !== 2
                          ? 'hidden'
                          : ''
                      }`}
                      iconPosition="end"
                      onClick={() => onUpdateBackReferral(item.id)}
                    />
                  </div>
                  <Divider
                    className={`p-4 ${
                      isWalkthrough && walkthroughState?.stepIndex !== 2
                        ? 'hidden'
                        : ''
                    }`}
                    dividerType="dashed"
                  />
                </>
              )}
              {/* Complted back referrals */}
              {item.backReferralCompleted && isShowCompletedItems && (
                <div className="my-4 flex items-center gap-3">
                  <div className="flex w-full flex-col">
                    <Typography
                      type="markdown"
                      align="left"
                      weight="bold"
                      text={item?.comment || ''}
                      color="textDark"
                      className="w-full"
                      hasMarkup={true}
                    />
                    <Typography
                      type="body"
                      align="left"
                      weight="skinny"
                      text={`Referred on ${format(
                        new Date(item.insertedDate),
                        'dd MMM yyyy'
                      )}`}
                      color="textMid"
                      className="text-sm"
                    />
                  </div>
                  <CheckCircleIcon
                    className="h-12 w-12"
                    style={{ fill: '#83BC26' }}
                  ></CheckCircleIcon>
                </div>
              )}
              {item.backReferralCompleted && (
                <Divider className="p-4" dividerType="dashed" />
              )}
            </div>
          ))}
          {!isWalkthrough &&
            completedReferralsForInfant &&
            completedReferralsForInfant?.length > 1 &&
            showCompletedButton && (
              <Button
                type="outlined"
                color="primary"
                textColor="primary"
                icon={isShowCompletedItems ? 'EyeOffIcon' : 'EyeIcon'}
                text={
                  isShowCompletedItems
                    ? 'Hide completed back-referrals'
                    : 'See completed back-referrals'
                }
                onClick={() =>
                  setIsShowCompletedItems((prevState) => !prevState)
                }
              />
            )}
          {/* Show referral button here when there are no back-referral   */}
          <Button
            text="Manage referrals"
            icon="ClipboardCheckIcon"
            type="filled"
            color="primary"
            textColor="white"
            className={`mt-4 w-full ${
              isWalkthrough && walkthroughState?.stepIndex !== 2 ? 'hidden' : ''
            }`}
            iconPosition="start"
            onClick={onShowReferrals}
          />
        </div>
      )}

      {/* EMPTY BODY: REFERRALS -----------------------------------------*/}
      {!isWalkthrough &&
        isReferralsView &&
        referralsForInfant?.length === 0 && (
          <div className="px-4 pb-4 pt-7">
            <div className="text-textMid flex w-full flex-wrap justify-center rounded-2xl py-6 px-4">
              <div className="bg-tertiary flex h-24 w-24 items-center justify-center rounded-full">
                <img src={thumbsUpImage} alt="momImage" className="h-26 w-29" />
              </div>
              <div className="flex w-full justify-center">
                <Typography
                  type="h3"
                  color={'textDark'}
                  text={`No referrals for ${infant?.user?.firstName || ''}! `}
                  className="pt-2"
                  align="center"
                />
              </div>
              <Typography
                type="body"
                align="center"
                weight="skinny"
                text="You can see and manage all your completed referrals & update back-referrals here."
                color="textMid"
              />
            </div>

            {/* Show back referral button when there are completed referrals  */}
            {completedReferralsForInfant &&
              completedReferralsForInfant?.length > 0 && (
                <Button
                  text="Manage back-referrals"
                  icon="ClipboardCheckIcon"
                  type="outlined"
                  color="primary"
                  textColor="primary"
                  className="mt-4 w-full"
                  iconPosition="start"
                  onClick={onShowBackReferrals}
                />
              )}
          </div>
        )}

      {/* EMPTY BODY: BACK-REFERRALS -----------------------------------------*/}
      {!isReferralsView && completedReferralsForInfant?.length === 0 && (
        <div className="px-4 pb-4 pt-7">
          <div className="text-textMid flex w-full flex-wrap justify-center rounded-2xl py-6 px-4">
            <div className="bg-tertiary flex h-24 w-24 items-center justify-center rounded-full">
              <img src={thumbsUpImage} alt="momImage" className="h-26 w-29" />
            </div>
            <div className="flex w-full justify-center">
              <Typography
                type="h3"
                color={'textDark'}
                text={`All back-referrals are completed for ${
                  infant?.user?.firstName || ''
                }! `}
                className="pt-2"
                align="center"
              />
            </div>
            <Typography
              type="body"
              align="center"
              weight="skinny"
              text="You can see your completed back-referrals here."
              color="textMid"
            />
          </div>

          {/* Show referral button here when there are no back-referral   */}
          <Button
            text="Manage referrals"
            icon="ClipboardCheckIcon"
            type="outlined"
            color="primary"
            textColor="primary"
            className="mt-4 w-full"
            iconPosition="start"
            onClick={onShowReferrals}
          />
        </div>
      )}
    </div>
  );
};
