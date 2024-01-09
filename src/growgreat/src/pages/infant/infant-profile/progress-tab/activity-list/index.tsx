import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useParams } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  BannerWrapper,
  Button,
  Colours,
  DialogPosition,
  Dialog,
  LoadingSpinner,
  MenuListDataItem,
  renderIcon,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';

import {
  getInfantById,
  getInfantNearestPreviousVisitByOrderDate,
  getInfantVisitByVisitIdSelector,
  getIsInfantFirstVisitSelector,
  getIsInfantSecondVisitSelector,
  getIsInfantFirstVisitForAgeSelector,
  getInfantLastVisitSelector,
} from '@/store/infant/infant.selectors';
import { activitiesList, activitiesTypes } from './activities-list';
import { Form } from './forms';
import { useWindowSize } from '@reach/window-size';
import { infantThunkActions } from '@/store/infant';
import { referralThunkActions } from '@/store/referral';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
import {
  getCompletedVisitsByVisitIdSelector,
  getPreviousVisitInformationForInfantSelector,
  getVisitAnswersForInfantSelector,
} from '@/store/visit/visit.selectors';
import { IntroScreen } from './intro-screen';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { DevelopmentalScreeningVisitSection } from './forms/pillar-2-steps/developmental-screening-weeks';
import { staticDataSelectors } from '@/store/static-data';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { userSelectors } from '@/store/user';
import { ActivityInfoPage } from './activity-info-page';
import { InfantProfileParams } from '../../infant-profile.types';
import { differenceInDays, differenceInCalendarMonths } from 'date-fns';
import { getAgeInYearsMonthsAndDays, usePrevious } from '@ecdlink/core';
import { documentSelectors } from '@/store/document';
import { dangerSignsVisitSectionForBaby } from './forms/care-for-baby-steps/danger-signs';
import { dangerSignsVisitSection } from './forms/care-for-mom-steps/danger-signs';
import {
  clinicCheckupQuestion,
  clinicCheckupSectionName,
} from './forms/care-for-mom-steps/clinic-check-ups';
import {
  HIVQuestion,
  HIVSection,
} from './forms/pillar-5-steps/hiv-care-and-medication';
import {
  birthCertificateQuestion,
  isCSGQuestion,
  childDocumentSection,
} from './forms/pillar-5-steps/child-documentation';
import { maternalDistressVisitSection } from './forms/care-for-mom-steps/maternal-distress-screening';
import { FileTypeEnum } from '@ecdlink/graphql';
import { useStaticData } from '@/hooks/useStaticData';
import { ReferralActions } from '@/store/referral/referral.actions';
import { InfantActions } from '@/store/infant/infant.actions';

export const INFANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const currentActivityKey = 'selectedOption';

export const ActivityList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isShowCompletedForms, setIsShowCompletedForms] = useState(false);
  const [isStartVisit, setIsStartVisit] = useState(false);
  const [displayHelp, setDisplayHelp] = useState(false);
  const relations = useSelector(staticDataSelectors.getRelations);
  const selectedOption = window.sessionStorage.getItem(currentActivityKey);
  const previousSelectedOption = usePrevious(selectedOption) as
    | string
    | undefined;
  const { getDocumentTypeIdByEnum } = useStaticData();
  const documentTypeId = getDocumentTypeIdByEnum(FileTypeEnum.RoadToHealthBook);
  const { isOnline } = useOnlineStatus();

  const { width } = useWindowSize();

  const history = useHistory();

  const { visitId, id: infantId } = useParams<InfantProfileParams>();

  const { isLoading: isLoadingPreviousVisit } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT
  );
  const { isLoading: isLoadingCompletedVisits } = useThunkFetchCall(
    'visits',
    VisitActions.GET_COMPLETED_VISITS_FOR_VISIT_ID
  );
  const { isLoading: isLoadingSummary } = useThunkFetchCall(
    'visits',
    VisitActions.GET_INFANT_SUMMARY_BY_PRIORITY
  );
  const { isLoading: isLoadingReferrals } = useThunkFetchCall(
    'referrals',
    ReferralActions.GET_REFERRAL_FOR_INFANT
  );
  const { isLoading: isLoadingVisits } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANT_VISITS
  );
  const { isLoading: isLoadingGrowthData } = useThunkFetchCall(
    'visits',
    VisitActions.GET_GROWTH_DATA_FOR_INFANT
  );
  const { isLoading: isLoadingVisitsAnswers } = useThunkFetchCall(
    'visits',
    VisitActions.GET_VISIT_ANSWERS_FOR_INFANT
  );

  const isLoading =
    isLoadingPreviousVisit ||
    isLoadingCompletedVisits ||
    isLoadingSummary ||
    isLoadingReferrals ||
    isLoadingVisits ||
    isLoadingGrowthData ||
    isLoadingVisitsAnswers;

  const user = useSelector(userSelectors.getUser);
  const documents = useSelector(
    documentSelectors.getDocumentsByUserId(infantId)
  );

  const currentVisit = useSelector((state: RootState) =>
    getInfantVisitByVisitIdSelector(state, visitId)
  );

  const previousCurrentVisit = useSelector(getInfantLastVisitSelector);

  const completedVisits = useSelector((state: RootState) =>
    getCompletedVisitsByVisitIdSelector(state, visitId)
  )?.visits;

  const appDispatch = useAppDispatch();

  useLayoutEffect(() => {
    appDispatch(
      visitThunkActions.getCompletedVisitsForVisitId({
        visitId,
      })
    ).unwrap();
    if (
      !!previousCurrentVisit &&
      previousCurrentVisit?.id !== currentVisit?.id &&
      !!currentVisit
    ) {
      appDispatch(
        visitThunkActions.getPreviousVisitInformationForInfant({
          visitId: previousCurrentVisit?.id,
        })
      ).unwrap();
    } else {
      if (!previousCurrentVisit && !!currentVisit) {
        appDispatch(
          visitThunkActions.getPreviousVisitInformationForInfant({
            visitId: currentVisit?.id,
          })
        );
      }
    }
    appDispatch(
      visitThunkActions.GetInfantSummaryByPriority({
        visitId,
      })
    );
  }, [visitId, appDispatch, previousCurrentVisit, currentVisit]);

  const previousCurrentVisitStatus = useSelector(
    getPreviousVisitInformationForInfantSelector
  );

  const previousVisit = useSelector((state: RootState) =>
    getInfantNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const infantName = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const dateOfBirth = infant?.user?.dateOfBirth as string;
  const ageDays = differenceInDays(new Date(), new Date(dateOfBirth));
  const ageMonths = differenceInCalendarMonths(
    new Date(),
    new Date(dateOfBirth)
  );
  const { years: ageYears } = getAgeInYearsMonthsAndDays(dateOfBirth);

  const isChildAfter49Days = useMemo(() => ageDays >= 50, [ageDays]);

  const isLargeName =
    (infant?.user?.firstName || '').length +
      (infant?.user?.surname || '').length >
    22;

  const isFirstVisit = useSelector(getIsInfantFirstVisitSelector);
  const isSecondVisit = useSelector(getIsInfantSecondVisitSelector);
  const isFirstVisitAfter9MonthsBefore24Months =
    useSelector((state: RootState) =>
      getIsInfantFirstVisitForAgeSelector(state, new Date(dateOfBirth), 9, 24)
    ) &&
    ageDays > 274 &&
    ageDays < 730;
  const isFirstVisitAfter24MonthsBefore60Months =
    useSelector((state: RootState) =>
      getIsInfantFirstVisitForAgeSelector(state, new Date(dateOfBirth), 24, 60)
    ) &&
    ageDays > 730 &&
    ageDays < 1825;

  const getIsFollowUp = useCallback(
    (section: string, visitName: string) => {
      return !!previousCurrentVisitStatus?.visitDataStatus?.some(
        (item) =>
          item?.section === section &&
          item.visitData?.visitName === visitName &&
          item.color !== 'Success'
      );
    },
    [previousCurrentVisitStatus?.visitDataStatus]
  );

  const hasRoadToHealthBook = useMemo(
    () => !!documents?.find((item) => item.documentTypeId === documentTypeId),
    [documentTypeId, documents]
  );

  const previousWeightAtBirth = usePrevious(infant?.weightAtBirth);
  const previousHasRoadToHealthBook = usePrevious(hasRoadToHealthBook);

  const isRoadToHealthBookStep =
    !previousHasRoadToHealthBook || !previousWeightAtBirth;

  const isDangerSignsFollowUpForBaby = getIsFollowUp(
    dangerSignsVisitSectionForBaby,
    activitiesTypes.careForBaby
  );

  const isChildBefore49Days = useMemo(() => ageDays <= 49, [ageDays]);

  const isNewBornCare = useMemo(() => ageDays <= 28, [ageDays]);

  const isKangarooMotherCare = useMemo(() => ageDays <= 49, [ageDays]);

  const isDevelopmentalScreening = useMemo(
    () =>
      ((isFirstVisit || isSecondVisit) && ageDays >= 4 && ageDays <= 27) ||
      (isFirstVisit && ageDays >= 49 && ageDays <= 56),
    [ageDays, isFirstVisit, isSecondVisit]
  );

  const isDevelopmentalScreeningWeeksFollowUp = getIsFollowUp(
    DevelopmentalScreeningVisitSection,
    activitiesTypes.pillar2
  );

  // INFO: 14 weeks -> 98 days
  const isDevelopmentalScreeningWeeks = useMemo(
    () =>
      isFirstVisit &&
      ((ageDays >= 98 && ageMonths < 5) || (ageMonths >= 6 && ageMonths < 21)),
    [ageDays, ageMonths, isFirstVisit]
  );

  const isDangerSignsFollowUpForMom = getIsFollowUp(
    dangerSignsVisitSection,
    activitiesTypes.careForMom
  );

  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);

  const previousClinicCheckUpAnswer = previousAnswers?.find(
    (item) =>
      item.question === clinicCheckupQuestion &&
      item.visitId === previousVisit?.id
  )?.questionAnswer;

  const isShowClinicCheckUps = useMemo(
    () =>
      (isFirstVisit && ageDays >= 7 && ageDays <= 27) ||
      (previousClinicCheckUpAnswer === 'false' && ageDays < 49) ||
      (isFirstVisit && ageDays >= 49 && ageDays <= 56) ||
      (previousClinicCheckUpAnswer === 'false' && ageDays < 57),
    [ageDays, previousClinicCheckUpAnswer, isFirstVisit]
  );

  const isSelfCareAndSupport = useMemo(
    () => isFirstVisit && ageDays >= 48 && ageDays <= 57,
    [ageDays, isFirstVisit]
  );

  const isMaternalDistress = useMemo(
    () =>
      (isFirstVisit && ageDays >= 49 && !ageYears && ageMonths < 9) ||
      isFirstVisitAfter9MonthsBefore24Months ||
      isFirstVisitAfter24MonthsBefore60Months,
    [
      ageDays,
      ageMonths,
      ageYears,
      isFirstVisit,
      isFirstVisitAfter24MonthsBefore60Months,
      isFirstVisitAfter9MonthsBefore24Months,
    ]
  );

  const previousBirthCertificateAnswer = previousAnswers?.find(
    (item) =>
      item.question === birthCertificateQuestion &&
      item.visitId === previousVisit?.id
  )?.questionAnswer;

  const previousCSGAnswer = previousAnswers?.find(
    (item) =>
      item.question === isCSGQuestion && item.visitId === previousVisit?.id
  )?.questionAnswer;

  const isChildDocumentStep = useMemo(
    () =>
      isFirstVisit ||
      previousBirthCertificateAnswer === 'false' ||
      (previousBirthCertificateAnswer === 'true' &&
        previousCSGAnswer === 'false'),
    [isFirstVisit, previousBirthCertificateAnswer, previousCSGAnswer]
  );

  const isMaternalDistressFollowUp = !!previousAnswers
    ?.filter((item) => item.visitSection === maternalDistressVisitSection)
    ?.filter((item) => item.questionAnswer?.includes('true'))?.length;

  const isMaternalDistressScreening = useMemo(
    () => isFirstVisit && ageDays >= 49 && ageYears < 5,
    [ageDays, ageYears, isFirstVisit]
  );

  const isDisplayPillar2 = [
    isDevelopmentalScreening,
    isDevelopmentalScreeningWeeks,
    isDevelopmentalScreeningWeeksFollowUp,
  ].some((item) => !!item);

  const isDisplayCareForBaby = [
    isRoadToHealthBookStep,
    isDangerSignsFollowUpForBaby,
    isChildBefore49Days,
    isNewBornCare,
    isKangarooMotherCare,
  ].some((item) => !!item);

  const is6Week = ageDays >= 49 && ageDays <= 56;
  const is10Week = ageDays >= 57 && ageMonths <= 3;
  const is14Week = ageMonths === 4;
  const is6Month = ageMonths >= 6 && ageMonths < 9;
  const is9Month = ageMonths >= 9 && ageMonths < 12;
  const is12Month = ageMonths >= 12 && ageMonths < 15;
  const is18Month = ageMonths >= 18 && ageMonths < 21;
  const is2Years = ageMonths >= 24 && ageMonths < 30;
  const is2YearsAHalfYears = ageMonths >= 30 && ageMonths < 36;
  const is3Years = ageMonths >= 36 && ageMonths < 42;
  const is3YearsAHalfYears = ageMonths >= 42 && ageMonths < 48;
  const is4Years = ageMonths >= 48 && ageMonths < 54;
  const is4AHalfYears = ageMonths >= 54 && ageMonths < 60;
  const is5Years = ageMonths >= 60;

  const isImmunisationQuestion =
    isFirstVisit &&
    (is6Week ||
      is10Week ||
      is14Week ||
      is6Month ||
      is9Month ||
      is12Month ||
      is18Month);

  const isVitaminAQuestion =
    isFirstVisit &&
    (is6Month ||
      is12Month ||
      is18Month ||
      is2Years ||
      is2YearsAHalfYears ||
      is3Years ||
      is3YearsAHalfYears ||
      is4Years ||
      is4AHalfYears ||
      is5Years);

  const isDewormingQuestion =
    isFirstVisit &&
    (is12Month ||
      is18Month ||
      is2Years ||
      is2YearsAHalfYears ||
      is3Years ||
      is3YearsAHalfYears ||
      is4Years ||
      is4AHalfYears ||
      is5Years);

  const isImmunisationsStep = useMemo(
    () =>
      isFirstVisit &&
      ((ageDays >= 28 && ageDays <= 48) || (!ageYears && ageMonths === 5)),
    [ageDays, ageMonths, ageYears, isFirstVisit]
  );

  const previousHIVAnswer = previousAnswers?.find(
    (item) =>
      item.question === HIVQuestion && item.visitId === previousVisit?.id
  )?.questionAnswer;

  const isHivCareStep = useMemo(
    () =>
      (isFirstVisit && !ageYears && ageMonths < 6) ||
      previousHIVAnswer !== 'false',
    [ageMonths, ageYears, isFirstVisit, previousHIVAnswer]
  );

  const isDisplayPillar3 =
    isImmunisationQuestion ||
    isVitaminAQuestion ||
    isDewormingQuestion ||
    isImmunisationsStep;

  const isDisplayPillar5 = isChildDocumentStep || isHivCareStep;

  const options: Intl.DateTimeFormatOptions = useMemo(
    () => ({
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    []
  );

  const { visibleActivities } = useMemo(() => {
    const motherType = relations.find((item) => item.description === 'Mother');

    const visibleActivities = activitiesList.filter((item) => {
      if (
        (item.id === activitiesTypes.pillar4 && !isChildAfter49Days) ||
        (item.id === activitiesTypes.pillar2 && !isDisplayPillar2) ||
        (item.id === activitiesTypes.careForBaby && !isDisplayCareForBaby) ||
        (item.id === activitiesTypes.careForMom &&
          infant?.caregiver?.relation?.description !==
            motherType?.description) ||
        (item.id === activitiesTypes.pillar3 && !isDisplayPillar3) ||
        (item.id === activitiesTypes.pillar5 && !isDisplayPillar5)
      )
        return undefined;

      return item;
    });

    return { visibleActivities };
  }, [
    relations,
    isChildAfter49Days,
    isDisplayPillar2,
    isDisplayCareForBaby,
    infant?.caregiver?.relation?.description,
    isDisplayPillar3,
    isDisplayPillar5,
  ]);

  const { completedForms, uncompletedForms, followUpForm, stepperCount } =
    useMemo(() => {
      const completedActivities = visibleActivities.filter((item) =>
        completedVisits?.includes(item.title)
      );
      const uncompletedActivities = visibleActivities.filter(
        (item) => !completedVisits?.includes(item.title)
      );

      const completedForms = completedActivities.map(
        (item): MenuListDataItem => ({
          showIcon: true,
          menuIconUrl: item?.menuIconUrl,
          menuIconClassName: 'border-0',
          title: item?.title,
          titleStyle: 'text-textDark',
          subTitle: '',
          iconBackgroundColor: 'successMain' as Colours,
          backgroundColor: 'successBg' as Colours,
          rightIcon: 'BadgeCheckIcon',
          rightIconClassName: 'h-5 w-5 text-successMain',
          onActionClick: () => {
            if (item.id) {
              window.sessionStorage.setItem(currentActivityKey, item.id);
              setShowForm(true);
            }
          },
        })
      );

      const uncompletedForms = uncompletedActivities.map(
        (item): MenuListDataItem => ({
          showIcon: true,
          menuIconUrl: item?.menuIconUrl,
          menuIconClassName: 'border-0',
          title: item?.title,
          titleStyle: 'text-textDark',
          subTitle: '',
          iconBackgroundColor: item.iconBackgroundColor as Colours,
          iconHexBackgroundColor: item.iconHexBackgroundColor,
          backgroundColor: (item.backgroundColor as Colours) || '',
          hexBackgroundColor: item.hexBackgroundColor || '',
          className: item.className,
          onActionClick: () => {
            if (item.id) {
              window.sessionStorage.setItem(currentActivityKey, item.id);
              setShowForm(true);
            }
          },
        })
      );

      const stepperCount = completedForms.length + uncompletedForms.length + 1; // +1 is for followup

      const followUpForm: MenuListDataItem[] = [
        {
          showIcon: true,
          menuIcon: 'CalendarIcon',
          menuIconClassName: 'border-0',
          iconColor: 'white',
          title: 'Follow up',
          titleStyle: 'text-textDark',
          subTitle: 'Schedule your next visit, make referrals & save notes',
          subTitleStyle: 'text-textDark',
          iconBackgroundColor: 'tertiary' as Colours,
          backgroundColor: 'uiBg' as Colours,
          onActionClick: () => {
            window.sessionStorage.setItem(currentActivityKey, 'Follow up');
            setShowForm(true);
          },
        },
      ];

      return { uncompletedForms, completedForms, followUpForm, stepperCount };
    }, [completedVisits, visibleActivities]);

  const isFollowUp =
    completedForms.length >= visibleActivities.length &&
    !completedVisits?.some((item) => item.includes('Follow'));
  const isAllCompleted =
    !!currentVisit?.attended ||
    completedVisits?.some((item) => item?.includes('Follow'));

  const goBack = useCallback(() => {
    if (isStartVisit) {
      return setIsStartVisit(false);
    }
    return history.push(`${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${infantId}`);
  }, [history, infantId, isStartVisit]);

  const onFormBack = () => {
    window.sessionStorage.removeItem(currentActivityKey);
    setShowForm(false);
  };

  const onHelp = () => {
    setDisplayHelp(true);
  };

  useLayoutEffect(() => {
    if (selectedOption) {
      setShowForm(true);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (
      !previousSelectedOption?.includes('Follow') &&
      selectedOption?.includes('Follow')
    ) {
      appDispatch(
        referralThunkActions.getReferralsForInfant({
          infantId: infantId,
          visitId: visitId,
        })
      ).unwrap();
    }
  }, [appDispatch, infantId, previousSelectedOption, selectedOption, visitId]);

  useLayoutEffect(() => {
    appDispatch(infantThunkActions.getInfantVisits({ infantId })).unwrap();
    appDispatch(
      visitThunkActions.getGrowthDataForInfant({ infantId })
    ).unwrap();
  }, [appDispatch, infantId, visitId]);

  useLayoutEffect(() => {
    appDispatch(
      visitThunkActions.getVisitAnswersForInfant({
        visitId,
        visitName: activitiesTypes.pillar2,
        visitSection: DevelopmentalScreeningVisitSection,
      })
    );
  }, [visitId, appDispatch]);

  useLayoutEffect(() => {
    if (previousVisit?.id) {
      appDispatch(
        visitThunkActions.getVisitAnswersForInfant({
          visitId: previousVisit.id,
          visitName: activitiesTypes.careForMom,
          visitSection: clinicCheckupSectionName,
        })
      ).unwrap();
      appDispatch(
        visitThunkActions.getVisitAnswersForInfant({
          visitId: previousVisit.id,
          visitName: activitiesTypes.pillar5,
          visitSection: childDocumentSection,
        })
      ).unwrap();
      appDispatch(
        visitThunkActions.getVisitAnswersForInfant({
          visitId: previousVisit.id,
          visitName: activitiesTypes.pillar5,
          visitSection: HIVSection,
        })
      ).unwrap();
      appDispatch(
        visitThunkActions.getVisitAnswersForInfant({
          visitId: previousVisit.id,
          visitName: activitiesTypes.careForMom,
          visitSection: maternalDistressVisitSection,
        })
      ).unwrap();
    }
  }, [previousVisit, appDispatch]);

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <LoadingSpinner
          size="medium"
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
          className="p-4"
        />
      );
    }

    if (
      isStartVisit ||
      !previousCurrentVisitStatus?.visitDataStatus?.length ||
      isAllCompleted
    ) {
      return (
        <div className="p-4">
          <Typography
            type="h2"
            align="left"
            weight="bold"
            text={'Your summary for this visit'}
            color="textDark"
            className="col-span-2"
          />
          <Typography
            type="body"
            align="left"
            weight="skinny"
            text={new Date().toLocaleDateString('en-ZA', options)}
            color="textMid"
          />
          {isAllCompleted ? (
            <>
              <PollyImpressed className="mt-11 h-28 w-full self-center" />
              <Typography
                type="h3"
                align="center"
                weight="bold"
                text={`Well done ${user?.firstName}`}
                color="textDark"
                className="w- mt-6 mb-2"
              />
              <Typography
                type="body"
                align="center"
                text={`You supported ${caregiverName} and ${infantName} through their first thousand days by completing all activities. Thank you!`}
                color="textMid"
                className="mb-4"
              />
              <div className="flex items-center justify-center gap-2">
                {renderIcon('GiftIcon', 'text-primary w-4 h-4')}
                <Typography
                  type="body"
                  align="center"
                  text={`You earned X points!`}
                  color="textDark"
                />
              </div>
              <Button
                className="mt-20 w-full"
                color="primary"
                textColor="white"
                type="filled"
                text="Back to client profile"
                onClick={goBack}
              />
            </>
          ) : (
            <>
              <Typography
                type="h4"
                align="left"
                weight="bold"
                text="Tap a button below to get started"
                color="textDark"
                className="mt-6 mb-4"
              />
              {isFollowUp && (
                <StackedList
                  isFullHeight={false}
                  className={'flex flex-col gap-2'}
                  listItems={followUpForm}
                  type={'MenuList'}
                />
              )}
              {!!uncompletedForms.length && (
                <>
                  <StackedList
                    isFullHeight={false}
                    className={'flex flex-col gap-2'}
                    listItems={uncompletedForms}
                    type={'MenuList'}
                  />
                </>
              )}
              <div className="mt-8 flex gap-1">
                {Array.from({ length: stepperCount }, (_, i) => (
                  <span
                    key={i}
                    className="rounded-10 h-2"
                    style={{
                      minWidth: 37,
                      background:
                        !!completedVisits?.length &&
                        i + 1 <= completedVisits?.length
                          ? '#26ACAF'
                          : '#D4EEEF',
                      width: width / stepperCount,
                    }}
                  />
                ))}
              </div>
            </>
          )}
          {!!completedVisits?.length && (
            <Button
              className={`${isAllCompleted ? 'mt-4' : 'mt-8'} w-full`}
              type="outlined"
              color="primary"
              textColor="primary"
              icon={isShowCompletedForms ? 'EyeOffIcon' : 'EyeIcon'}
              text={
                isShowCompletedForms
                  ? 'Hide completed activities'
                  : 'See completed activities'
              }
              onClick={() => setIsShowCompletedForms((prevState) => !prevState)}
            />
          )}
          {isShowCompletedForms && (
            <StackedList
              isFullHeight={false}
              className={'mt-8 flex flex-col gap-2'}
              listItems={completedForms}
              type={'MenuList'}
            />
          )}
        </div>
      );
    }

    return (
      <IntroScreen infant={infant} onStartVisit={() => setIsStartVisit(true)} />
    );
  }, [
    caregiverName,
    completedForms,
    completedVisits?.length,
    followUpForm,
    goBack,
    infant,
    infantName,
    isAllCompleted,
    isFollowUp,
    isLoading,
    isShowCompletedForms,
    isStartVisit,
    options,
    previousCurrentVisitStatus?.visitDataStatus?.length,
    stepperCount,
    uncompletedForms,
    user?.firstName,
    width,
  ]);

  if (showForm && selectedOption) {
    return (
      <Form
        stepsRules={{
          isRoadToHealthBookStep,
          isDevelopmentalScreening,
          isDevelopmentalScreeningWeeks,
          isDevelopmentalScreeningWeeksFollowUp,
          isChildBefore49Days,
          isDangerSignsFollowUpForBaby,
          isKangarooMotherCare,
          isNewBornCare,
          isDangerSignsFollowUpForMom,
          isShowClinicCheckUps,
          isSelfCareAndSupport,
          isMaternalDistress,
          isMaternalDistressFollowUp,
          isMaternalDistressScreening,
          isImmunisationQuestion,
          isVitaminAQuestion,
          isDewormingQuestion,
          isImmunisationsStep,
          isChildDocumentStep,
          isHivCareStep,
        }}
        onBack={onFormBack}
        getIsFollowUp={getIsFollowUp}
      />
    );
  }

  return (
    <>
      <BannerWrapper
        size="medium"
        renderBorder
        onBack={goBack}
        title={`${infant?.user?.firstName || ''} ${
          !isLargeName ? infant?.user?.surname || '' : ''
        }`}
        subTitle="Child visit activities"
        backgroundColour="white"
        displayOffline={!isOnline}
        displayHelp
        onHelp={onHelp}
      >
        {renderContent}
      </BannerWrapper>
      <Dialog
        fullScreen={true}
        visible={displayHelp}
        position={DialogPosition.Full}
      >
        <ActivityInfoPage
          section="Activity Info"
          subTitle="Road to health activities"
          setDisplayHelp={setDisplayHelp}
        />
      </Dialog>
    </>
  );
};
