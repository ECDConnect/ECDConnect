import {
  Alert,
  Button,
  CheckboxChange,
  CheckboxGroup,
  Divider,
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

  const [showMarkAllButton, setShowMarkAllButton] = useState(true);
  const [isReferralsView, setIsReferralsView] = useState(true);
  const [isShowCompletedItems, setIsShowCompletedItems] = useState(false);
  const [showCompletedButton, setShowCompletedButton] = useState(false);

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

  const currentVisit = useSelector((state: RootState) =>
    getInfantCurrentVisitSelector(state, '')
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
        let _showAllMarkButton = false;
        for (const item of newState) {
          if (!item.isCompleted) {
            _showAllMarkButton = true;
          }
        }
        setShowMarkAllButton(_showAllMarkButton);

        // saving the new state for data status record
        if (newState.length > 0) {
          // appDispatch(infantActions.addInfantCompleteReferrals(newState));
          appDispatch(
            infantThunkActions.updateVisitDataStatus({ input: newState })
          ).unwrap();
        }

        return newState;
      });
    },
    [setReferralsInput, appDispatch]
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

  const previousGroupedData = usePrevious(groupedData) as
    | GroupedData
    | undefined;

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
    if (previousGroupedData === undefined && groupedData !== undefined) {
      return setAnswers(groupedData);
    }
  }, [groupedData, previousGroupedData]);

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
        const { id, isCompleted } = item;
        return { id, isCompleted };
      });

      handleSetReferrals?.(formattedQuestions);
      setAnswers(updatedQuestions);
    },
    [handleSetReferrals, questions]
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
    let currentQuestions: any;
    for (const section of sections) {
      currentQuestions = questions[section.value];
      for (const question of currentQuestions) {
        const referral = questions[section.value].find(
          (item) => item.comment === question.comment
        );

        return onOptionSelected(
          { ...referral, isCompleted: true },
          section.value
        );
      }
    }
  }, [onOptionSelected, sections, questions]);

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

          {showMarkAllButton && (
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

          {sections?.map((section) => (
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
          {(!showMarkAllButton ||
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
