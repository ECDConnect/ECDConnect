import {
  Alert,
  Button,
  CheckboxChange,
  CheckboxGroup,
  Divider,
  RoundIcon,
  Typography,
  LoadingSpinner,
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
import thumbsUpImage from '@/assets/thumbsUp.png';
import {
  getStringFromClassNameOrId,
  toCamelCase,
  usePrevious,
} from '@ecdlink/core';
import { VisitDataStatus, VisitDataStatusFilterInput } from '@ecdlink/graphql';
import { ReactComponent as PollyImpressed } from '@/assets/celebrateIcon.svg';
import { format } from 'date-fns';
import {
  getMotherCurrentVisitSelector,
  getMotherById,
  getMotherNearestPreviousVisitByOrderDate,
} from '@/store/mother/mother.selectors';
import { motherSelectors, motherThunkActions } from '@/store/mother';
import { getReferralsForMotherSelector } from '@/store/mother/mother.selectors';
import { MotherActions } from '@/store/mother/mother.actions';
import { CheckCircleIcon } from '@heroicons/react/solid';
import ROUTES from '@/routes/routes';
import { useWalkthrough } from '@/context/walkthroughContext';
import { referralsSteps } from './walkthrough/steps';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  notificationActions,
  notificationsSelectors,
} from '@/store/notifications';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { notificationTagConfig } from '@/constants/notifications';

const HEADER_HEIGHT = 64;

interface GroupedData {
  [key: string]: VisitDataStatus[];
  clinicReferrals: VisitDataStatus[];
  departmentOfHomeAffairsReferrals: VisitDataStatus[];
  immunisationsSupplementsAndDeworming: VisitDataStatus[];
}

export interface MotherParams {
  id: string;
}

export const ReferralsTab: React.FC = () => {
  const { height } = useWindowSize();
  const history = useHistory();
  const location = useLocation();
  const appDispatch = useAppDispatch();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [referralsInput, setReferralsInput] =
    useState<VisitDataStatusFilterInput[]>();
  const [showMarkAllButton] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isReferralsView, setIsReferralsView] = useState(true);
  const [isShowCompletedItems, setIsShowCompletedItems] = useState(false);
  const [showCompletedButton, setShowCompletedButton] = useState(false);

  const { isLoading: isLoadingReferrals } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_REFERRALS_FOR_MOTHER
  );
  const { isLoading: isLoadingCompletedReferrals } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_COMPLETED_REFERRALS_FOR_MOTHER
  );
  const { isLoading: isLoadingUpdateVisitData } = useThunkFetchCall(
    'mothers',
    MotherActions.UPDATE_VISIT_DATA_STATUS
  );

  const isLoading =
    isLoadingReferrals ||
    isLoadingCompletedReferrals ||
    isLoadingUpdateVisitData;

  const { walkthroughState, isWalkthroughSession, walkthroughDispatch } =
    useWalkthrough();

  const { id: motherId } = useParams<MotherParams>();
  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const redAlertNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter(
    (item) =>
      item?.message?.cta?.includes(
        notificationTagConfig?.RedAlertReferralMother.cta ?? ''
      ) && item?.message?.action?.includes(motherId)
  );

  const dangerSignsNotifications = useSelector(
    notificationsSelectors.getAllNotifications
  ).filter(
    (item) =>
      item?.message?.cta?.includes(
        notificationTagConfig?.DangerSignsReferral.cta ?? ''
      ) && item?.message?.action?.includes(motherId)
  );

  const currentVisit = useSelector((state: RootState) =>
    getMotherCurrentVisitSelector(state, '')
  );

  const previousVisit = useSelector((state: RootState) =>
    getMotherNearestPreviousVisitByOrderDate(state, currentVisit)
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
        motherThunkActions.getReferralsForMother({
          motherId: motherId,
          visitId: '',
        })
      ).unwrap();
    } else if (currentVisit) {
      appDispatch(
        motherThunkActions.getReferralsForMother({
          motherId: motherId,
          visitId: currentVisit.id,
        })
      ).unwrap();
    }
  }, [
    appDispatch,
    motherId,
    currentVisit,
    previousVisit,
    isToGetPreviousVisitStatusData,
  ]);

  // Getting referrals already approved
  useLayoutEffect(() => {
    if (isToGetPreviousVisitStatusData) {
      appDispatch(
        motherThunkActions.getCompletedReferralsForMother({
          motherId: motherId,
          visitId: previousVisit.id,
        })
      ).unwrap();
    } else if (currentVisit) {
      appDispatch(
        motherThunkActions.getCompletedReferralsForMother({
          motherId: motherId,
          visitId: currentVisit.id,
        })
      ).unwrap();
    }
  }, [
    appDispatch,
    motherId,
    currentVisit,
    isToGetPreviousVisitStatusData,
    previousVisit,
  ]);

  const referralsForMother = useSelector(getReferralsForMotherSelector);

  const completedreferralsForMother = useSelector(
    motherSelectors.getCompletedReferralsForMotherSelector
  );

  // group data under sections
  const groupedData = useMemo(() => {
    const groupedData = referralsForMother?.reduce(
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
  }, [referralsForMother]) as GroupedData;

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
          comment: 'Missed clinic visit',
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
  }, [isWalkthrough, walkthroughData.questions, wasWalkthrough]);

  useEffect(() => {
    if (groupedData !== undefined) {
      return setAnswers(groupedData);
    }
  }, [groupedData]);

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

        if (totalCompleted === referralsForMother?.length) {
          _showCelebration = true;
        }
        setShowCelebration(_showCelebration);

        // saving the new state for data status record
        if (newState.length > 0) {
          appDispatch(
            motherThunkActions.updateVisitDataStatus({ input: newState })
          ).unwrap();

          const removeRedAlertNotification = newState.find(
            (item) =>
              item.isCompleted &&
              String(item.comment).includes(
                'was experiencing maternal distress'
              )
          );

          if (redAlertNotifications && removeRedAlertNotification) {
            redAlertNotifications.forEach((x) => {
              appDispatch(notificationActions.removeNotification(x!));
              appDispatch(
                disableBackendNotification({
                  notificationId: x?.message?.reference ?? '',
                })
              );
            });
          }

          const removeDangerSignNotification = newState.find(
            (item) =>
              item.isCompleted &&
              String(item.comment).includes('was experiencing:')
          );

          if (dangerSignsNotifications && removeDangerSignNotification) {
            dangerSignsNotifications.forEach((x) => {
              appDispatch(notificationActions.removeNotification(x!));
              appDispatch(
                disableBackendNotification({
                  notificationId: x?.message?.reference ?? '',
                })
              );
            });
          }
        }
        return newState;
      });
    },
    [
      appDispatch,
      dangerSignsNotifications,
      redAlertNotifications,
      referralsForMother?.length,
    ]
  );

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
        motherThunkActions.getCompletedReferralsForMother({
          motherId: motherId,
          visitId: previousVisit.id,
        })
      ).unwrap();
    } else if (currentVisit) {
      appDispatch(
        motherThunkActions.getCompletedReferralsForMother({
          motherId: motherId,
          visitId: currentVisit.id,
        })
      ).unwrap();
    }

    setIsReferralsView(false);
    if (completedreferralsForMother)
      for (const item of completedreferralsForMother) {
        if (item.backReferralCompleted) {
          setShowCompletedButton(true);
          break;
        }
      }
  }, [
    isToGetPreviousVisitStatusData,
    currentVisit,
    completedreferralsForMother,
    appDispatch,
    motherId,
    previousVisit?.id,
  ]);

  const onShowReferrals = useCallback(() => {
    setIsReferralsView(true);
  }, []);

  const onUpdateBackReferral = useCallback(
    (id) => {
      history.push(`${location.pathname}/update-back-referral/${id}`, {
        activeTabIndex: ROUTES.CLIENTS.INFANT_PROFILE.REFERRAL_TAB,
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
              text={`Referrals for ${mother?.user?.firstName || ''} `}
            />
            <Typography
              className="col-span-2 row-span-2"
              type="body"
              align="left"
              weight="skinny"
              text={`${referralsForMother?.length} referrals`}
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
              text={`Back-referrals for ${mother?.user?.firstName || ''} `}
            />
            <Typography
              className="col-span-2 row-span-2"
              type="body"
              align="left"
              weight="skinny"
              text={`${completedreferralsForMother?.length} back-referrals to update`}
              color="textMid"
            />
          </div>
        </div>
      )}

      {/* BODY: REFERRALS -----------------------------------------*/}
      {((isReferralsView && referralsForMother?.length !== 0) ||
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
                  text={section.label || ''}
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
                    mother?.user?.firstName || ''
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

      {((!isReferralsView &&
        completedreferralsForMother &&
        completedreferralsForMother?.length > 0) ||
        (Number(walkthroughState?.stepIndex) >= 1 &&
          Number(walkthroughState?.stepIndex) < 3)) && (
        <div className="px-4 pb-4 pt-7">
          {(
            completedreferralsForMother ||
            (walkthroughData.completedReferrals as VisitDataStatus[])
          )?.map((item: VisitDataStatus) => (
            <div key={item?.id}>
              {/* Not completed back referrals */}
              {!item.backReferralCompleted && (
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
                      color="textDark"
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
              )}
              <Divider
                className={`p-4 ${
                  isWalkthrough && walkthroughState?.stepIndex !== 2
                    ? 'hidden'
                    : ''
                }`}
                dividerType="dashed"
              />
              {/* Complted back referrals */}
              {item.backReferralCompleted && isShowCompletedItems && (
                <div className="my-4 flex items-center gap-3">
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
                      color="textDark"
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
              {/* <Divider
                className="p-4"
                dividerType="dashed"
              /> */}
            </div>
          ))}
          {!isWalkthrough &&
            completedreferralsForMother &&
            completedreferralsForMother?.length > 1 &&
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
        referralsForMother?.length === 0 && (
          <div className="px-4 pb-4 pt-7">
            <div className="text-textMid flex w-full flex-wrap justify-center rounded-2xl py-6 px-4">
              <div className="bg-tertiary flex h-24 w-24 items-center justify-center rounded-full">
                <img src={thumbsUpImage} alt="momImage" className="h-26 w-29" />
              </div>
              <div className="flex w-full justify-center">
                <Typography
                  type="h3"
                  color={'textDark'}
                  text={`No referrals for ${mother?.user?.firstName || ''}! `}
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
            {completedreferralsForMother &&
              completedreferralsForMother?.length > 0 && (
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
      {!isReferralsView && completedreferralsForMother?.length === 0 && (
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
                  mother?.user?.firstName || ''
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
