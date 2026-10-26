import {
  pointsActivitiesIds,
  pointsConstants,
  practitionerActivitiesItems,
  principalActivitiesItems,
} from '@/constants/points';
import { pointsSelectors, pointsThunkActions } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import {
  BannerWrapper,
  Button,
  CelebrationCard,
  Dialog,
  DialogPosition,
  Divider,
  MenuListDataItem,
  NoPointsScoreCard,
  ScoreCard,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import EmojiHappyYellow from '../../../assets/ECD_Connect_emoji3.svg?react';
import EmojiGreenSmile from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg?react';
import EmojiBlueSmile from '../../../assets/emoji_blue_smile_eye_open.svg?react';
import EmojiOrangeSmile from '../../../assets/mehFace.svg?react';
import { format, getMonth, getYear } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PointsSummaryDto,
  captureAndDownloadComponent,
  useDialog,
} from '@ecdlink/core';
import ROUTES from '@/routes/routes';
import { PointsShare } from '../points-share/points-share';
import { PointsInfoPage } from '../info/points-info-page';
import { authSelectors } from '@/store/auth';
import { PointsTodoItem } from './components/points-todo-item/points-todo-item';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import Kindgarden from '@/assets/icon/kindergarten1.svg?react';
import Crown from '@/assets/icon/crown.svg?react';
import { useTenant } from '@/hooks/useTenant';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';
import { BusinessTabItems } from '@/pages/business/business.types';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { usePoints } from '@/hooks/usePoints';
import { usePointsToDoEmoji } from '@/hooks/usePointsToDoEmoji';

export const PointsSummary: React.FC = () => {
  const isTrialPeriod = useIsTrialPeriod();

  const history = useHistory();
  const dispatch = useAppDispatch();
  const dialog = useDialog();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [showInfo, setShowInfo] = useState(false);
  const pointsToDo = useSelector(pointsSelectors.getPointsToDo);
  const planActivitiesPermission = practitioner?.permissions?.find(
    (item) =>
      item?.permissionName === PermissionsNames.plan_classroom_actitivies
  );
  const attendancePermission = practitioner?.permissions?.find(
    (item) => item?.permissionName === PermissionsNames.take_attendance
  );

  const pointsSummaryDataWithLibrary = useSelector(
    pointsSelectors.getPointsSummaryWithLibrary(new Date())
  );
  const pointsSummaryData = useSelector(pointsSelectors.getPointsSummary);
  const monthPoints = useSelector(pointsSelectors.getMonthPointsSummary);

  const pointsTotalForYear = useSelector(pointsSelectors.getTotalYearPoints);

  const pointsShareData = useSelector(pointsSelectors.getPointsShareData);

  const getPointsToDoItems = useCallback(async () => {
    const response = dispatch(
      pointsThunkActions.pointsTodoItems({ userId: practitioner?.userId! })
    );
    return response;
  }, [dispatch, practitioner?.userId]);

  const {
    phase1StatusText,
    isPhase1Completed,
    showPhase2Card,
    getCurrentPointsToDo,
    renderPointsToDoProgressBarColor,
    renderPointsToDoScoreCardBgColor,
    isPartOfPreschool,
  } = usePoints();

  const { renderPointsToDoEmoji } = usePointsToDoEmoji();

  const getshareData = useCallback(async () => {
    const response = await dispatch(
      pointsThunkActions.sharedData({
        userId: practitioner?.userId!,
        isMonthly: true,
      })
    );

    return response;
  }, [dispatch, practitioner?.userId]);

  const getYearPoints = useCallback(async () => {
    const response = await dispatch(
      pointsThunkActions.yearPointsView({
        userId: practitioner?.userId!,
      })
    );
    return response;
  }, [dispatch, practitioner?.userId]);

  const todoListFiltered = practitioner?.isPrincipal
    ? principalActivitiesItems
    : pointsShareData?.activityDetail?.length === 0
    ? practitionerActivitiesItems?.filter((item2) =>
        attendancePermission?.isActive !== true
          ? item2?.activity !== 'Attendance registers saved'
          : item2
      )
    : practitionerActivitiesItems
        ?.filter((item2) =>
          attendancePermission?.isActive !== true
            ? item2?.activity !== 'Attendance registers saved'
            : item2
        )
        ?.filter((el) => {
          return pointsShareData?.activityDetail?.some((f: any) => {
            return f.activity !== el.activity;
          });
        });

  const clickInfluencerHandler = () => {
    if (isOnline) {
      history.push(ROUTES.COMMUNITY.WELCOME);
    } else {
      showOnlineOnly();
      return;
    }
  };

  const getPhase1StackedMenuList = (): MenuListDataItem[] => {
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-normal text-textMid';
    const completedTitleStyle =
      'text-successDark font-semibold text-base leading-snug';
    const completedSubTitleStyle = 'text-sm font-normal text-successDark';
    const stackedMenuList: MenuListDataItem[] = [];

    const completedVisual = {
      titleStyle: completedTitleStyle,
      subTitleStyle: completedSubTitleStyle,
      menuIcon: 'CheckIcon',
      iconBackgroundColor: 'successMain' as const,
      iconColor: 'white' as const,
      backgroundColor: 'successBg' as const,
      showIcon: true,
      hideRightIcon: true,
    };

    const lockedVisual = {
      titleStyle,
      subTitleStyle,
      iconBackgroundColor: 'uiLight' as const,
      iconColor: 'white' as const,
      backgroundColor: 'adminPortalBg' as const,
      showIcon: true,
      hideRightIcon: true,
    };

    const canClickTichere = tenant.isWhiteLabel
      ? pointsToDo?.signedUpForApp && !isPartOfPreschool
      : pointsToDo?.signedUpForApp && !isPartOfPreschool;

    const tichereUrl = practitioner?.isPrincipal
      ? ROUTES.PRINCIPAL.SETUP_PROFILE
      : practitioner?.principalHierarchy && !practitioner?.dateAccepted
      ? ROUTES.PRACTITIONER.PROFILE.EDIT
      : ROUTES.PRINCIPAL.SETUP_PROFILE;

    const canClickInfluencer =
      isPartOfPreschool && !pointsToDo?.viewedCommunitySection;

    const bossCompleted = practitioner?.isPrincipal
      ? !!pointsToDo?.savedIncomeOrExpense
      : !!pointsToDo?.plannedOneDay;
    const influencerUnlocked =
      bossCompleted ||
      (!practitioner?.isPrincipal &&
        planActivitiesPermission?.isActive === false &&
        isPartOfPreschool);

    const umtsha: MenuListDataItem = {
      id: '1',
      title: 'Umtsha',
      subTitle: `Sign up for ${appName}`,
      onActionClick: () => {},
      ...(pointsToDo?.signedUpForApp
        ? completedVisual
        : {
            titleStyle,
            subTitleStyle,
            menuIcon: 'ClipboardCheckIcon',
            iconBackgroundColor: 'alertMain' as const,
            iconColor: 'white' as const,
            backgroundColor: 'alertBg' as const,
            showIcon: true,
            hideRightIcon: true,
          }),
    };

    const tichere: MenuListDataItem = {
      id: '2',
      title: 'Tichere',
      subTitle: 'Set up or join your preschool',
      onActionClick: canClickTichere
        ? () => history.push(tichereUrl, {})
        : () => {},
      ...(isPartOfPreschool
        ? completedVisual
        : {
            titleStyle,
            subTitleStyle,
            svgIcon: Kindgarden,
            iconBackgroundColor: 'secondary' as const,
            iconColor: 'white' as const,
            backgroundColor: 'secondaryAccent2' as const,
            showIcon: true,
            hideRightIcon: true,
          }),
    };

    const bossOrCwepheshe: MenuListDataItem = {
      id: '3',
      title: practitioner?.isPrincipal ? 'Boss' : 'Cwepheshe',
      subTitle: practitioner?.isPrincipal
        ? 'Add income/expense'
        : 'Plan your daily routine',
      onActionClick:
        isPartOfPreschool &&
        !pointsToDo?.savedIncomeOrExpense &&
        practitioner?.isPrincipal
          ? () =>
              history.push(ROUTES.BUSINESS, {
                activeTabIndex: BusinessTabItems.MONEY,
              })
          : isPartOfPreschool &&
            !pointsToDo?.savedIncomeOrExpense &&
            !practitioner?.isPrincipal
          ? () =>
              history.push(ROUTES.CLASSROOM.ROOT, {
                activeTabIndex: TabsItems.ACTIVITES,
              })
          : () => {},
      ...(bossCompleted
        ? completedVisual
        : isPartOfPreschool
        ? {
            titleStyle,
            subTitleStyle,
            menuIcon: practitioner?.isPrincipal ? undefined : 'CalendarIcon',
            svgIcon: practitioner?.isPrincipal ? Crown : undefined,
            iconBackgroundColor: 'quatenary' as const,
            iconColor: 'white' as const,
            backgroundColor: 'quatenaryBg' as const,
            showIcon: true,
            hideRightIcon: true,
          }
        : {
            ...lockedVisual,
            menuIcon: practitioner?.isPrincipal ? undefined : 'CalendarIcon',
            svgIcon: practitioner?.isPrincipal ? Crown : undefined,
          }),
    };

    const influencer: MenuListDataItem = {
      id: '4',
      title: 'Influencer',
      subTitle: 'Explore the community',
      onActionClick: canClickInfluencer
        ? () => clickInfluencerHandler()
        : () => {},
      ...(pointsToDo?.viewedCommunitySection
        ? completedVisual
        : influencerUnlocked
        ? {
            titleStyle: 'text-white font-semibold text-base leading-snug',
            subTitleStyle: 'text-white text-sm font-normal',
            menuIcon: 'FireIcon',
            iconBackgroundColor: 'white' as const,
            iconColor: 'quatenary' as const,
            backgroundColor: 'quatenary' as const,
            showIcon: true,
            hideRightIcon: true,
          }
        : {
            ...lockedVisual,
            menuIcon: 'FireIcon',
          }),
    };

    stackedMenuList.push(umtsha);
    stackedMenuList.push(tichere);

    if (!isPartOfPreschool) {
      stackedMenuList.push(influencer);
    } else {
      if (isPrincipal) {
        if (
          !pointsToDo?.savedIncomeOrExpense &&
          pointsToDo?.viewedCommunitySection
        ) {
          stackedMenuList.push(influencer);
          stackedMenuList.push(bossOrCwepheshe);
        } else {
          stackedMenuList.push(bossOrCwepheshe);
          stackedMenuList.push(influencer);
        }
      } else {
        if (!planActivitiesPermission?.isActive) {
          stackedMenuList.push(influencer);
        } else {
          if (
            !pointsToDo?.plannedOneDay &&
            pointsToDo?.viewedCommunitySection
          ) {
            stackedMenuList.push(influencer);
            stackedMenuList.push(bossOrCwepheshe);
          } else {
            stackedMenuList.push(bossOrCwepheshe);
            stackedMenuList.push(influencer);
          }
        }
      }
    }
    return stackedMenuList;
  };

  useEffect(() => {
    getPointsToDoItems();
    getshareData();
    getYearPoints();
  }, []);

  const pointsTodoList = useMemo(() => {
    const pointsList: PointsSummaryDto[] = [];

    pointsSummaryDataWithLibrary?.forEach((pointsActivity) => {
      // Regular non-maxed monthly activities
      if (
        (pointsActivity.pointsLibraryId ===
          pointsActivitiesIds.SubmitAttendance ||
          pointsActivity.pointsLibraryId ===
            pointsActivitiesIds.SubmitIncomeStatement ||
          pointsActivity.pointsLibraryId ===
            pointsActivitiesIds.MonthlyPreschoolFeesAdded) &&
        pointsActivity.pointsTotal !== pointsActivity.maxMonthlyPoints
      ) {
        pointsList.push(pointsActivity);
      }
      // Updated fees for the year (Principals/FAAs only)
      else if (
        pointsActivity.pointsLibraryId ===
          pointsActivitiesIds.MonthlyPreschoolFeeUpdated &&
        pointsActivity.pointsYTD === 0 &&
        practitioner?.isPrincipal
      ) {
        pointsList.push(pointsActivity);
      }
    });

    return pointsList;
  }, [pointsSummaryDataWithLibrary, practitioner?.isPrincipal]);

  const currentMonth = new Date().getMonth(); // +1 for 0 index

  const currentYear = new Date().getFullYear();
  const pointsTotal = pointsSummaryData.reduce((total, current) => {
    const dataMonth = getMonth(new Date(current?.dateScored));
    const dataYear = getYear(new Date(current?.dateScored));
    if (dataMonth === currentMonth && dataYear === currentYear) {
      return (total += current.pointsTotal);
    }
    return total;
  }, 0);
  let pointsMax = isPrincipal
    ? pointsConstants.principalOrAdminMonthlyMax
    : pointsConstants.practitionerMonthlyMax;

  const percentageScore = (monthPoints / pointsMax) * 100;

  const getTitleColor = (color: string) => {
    switch (color) {
      case 'alertMain':
        return 'alertDark';
      case 'successMain':
        return 'successMain';
      case 'infoMain':
        return 'quatenary';
      default:
        return 'alertDark';
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case 'alertMain':
        return 'alertBg';
      case 'successMain':
        return 'successBg';
      case 'infoMain':
        return 'quatenaryBg';
      default:
        return 'alertBg';
    }
  };

  const getEmoji = (color: string) => {
    switch (color) {
      case 'alertMain':
        return <EmojiOrangeSmile className="mr-2 h-28 w-28" />;
      case 'successMain':
        return <EmojiGreenSmile className="mr-2 h-28 w-28" />;
      case 'infoMain':
        return <EmojiBlueSmile className="mr-2 h-28 w-28" />;
      default:
        return <EmojiOrangeSmile className="mr-2 h-20 w-20" />;
    }
  };

  // without this rule the progress bar goes beyond the component
  if (pointsTotal > pointsMax) {
    pointsMax = pointsTotal;
  }

  const celebrationCard = useMemo(() => {
    if (percentageScore >= 80) {
      return (
        <CelebrationCard
          image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Wow, well done ${practitioner?.user?.firstName}!`}
          secondaryMessage="You’re doing well, keep it up!"
          primaryTextColour="successMain"
          secondaryTextColour="black"
          backgroundColour="successBg"
        />
      );
    }
    if (percentageScore >= 60 && percentageScore <= 79) {
      return (
        <CelebrationCard
          image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Wow, great job ${practitioner?.user?.firstName}!`}
          secondaryMessage="You’re doing well, keep it up! You can still earn more points this month."
          primaryTextColour="quatenary"
          secondaryTextColour="textDark"
          backgroundColour="quatenaryBg"
        />
      );
    }
    if (percentageScore > 0 && percentageScore < 60) {
      return (
        <CelebrationCard
          image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
          primaryTextColour="alertMain"
          backgroundColour="alertBg"
          secondaryMessage={`Keep using ${tenant?.tenant?.applicationName} to earn points!`}
          secondaryTextColour="textDark"
        />
      );
    }
    return (
      <CelebrationCard
        image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
        primaryMessage={`No points earned yet`}
        secondaryMessage="Keep going to earn points!"
        primaryTextColour="alertMain"
        secondaryTextColour="textDark"
        backgroundColour="alertBg"
      />
    );
  }, [
    percentageScore,
    practitioner?.user?.firstName,
    tenant?.tenant?.applicationName,
  ]);

  // SHARE LOGIC
  const shareRef = useRef<HTMLDivElement>(null);
  const [showPrintData, setShowPrintData] = useState(false);

  const showOnlineOnly = useCallback(() => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  }, [dialog]);

  const handleSeeDetailedReport = useCallback(() => {
    if (!isOnline) {
      showOnlineOnly();
      return;
    } else {
      history.push(ROUTES.PRACTITIONER.POINTS.YEAR, {
        userRankingData: pointsShareData?.userRankingData,
      });
    }
  }, [history, isOnline, pointsShareData?.userRankingData, showOnlineOnly]);

  return (
    <>
      <BannerWrapper
        size="medium"
        renderBorder={true}
        onBack={() => history.goBack()}
        title="Points"
        backgroundColour="white"
        displayHelp={true}
        onHelp={() => setShowInfo(true)}
        displayOffline={!isOnline}
      >
        <div className="mt-5 flex-col justify-center p-4">
          <Typography
            type={'h1'}
            color="black"
            text={format(new Date(), 'MMMM yyyy')}
          />
          {/* Phase 1 ------------------------------------------------------ */}

          {/* Phase 1 not completed */}
          {!isPhase1Completed && (
            <>
              <NoPointsScoreCard
                image={renderPointsToDoEmoji}
                className="mt-5 py-6"
                mainText={phase1StatusText ?? 'Umtsha'}
                currentPoints={getCurrentPointsToDo}
                maxPoints={
                  isTrialPeriod
                    ? 6
                    : practitioner?.isPrincipal ||
                      (!practitioner?.isPrincipal &&
                        planActivitiesPermission?.isActive === true)
                    ? 4
                    : 3
                }
                barBgColour="white"
                barColour={renderPointsToDoProgressBarColor}
                bgColour={renderPointsToDoScoreCardBgColor}
                textColour="black"
                isBigTitle={false}
              />
              <Divider dividerType="dashed" className="mt-4" />
              <Typography
                className="mb-4 mt-4"
                type={'h3'}
                color="black"
                text={`Get to the next level!`}
              />

              <div>
                <StackedList
                  listItems={getPhase1StackedMenuList()}
                  type={'MenuList'}
                  className={'flex flex-col gap-3'}
                ></StackedList>
              </div>
            </>
          )}
          {/* Phase 1 complete and still no points */}
          {isPhase1Completed && pointsTotalForYear === 0 ? (
            <>
              <CelebrationCard
                image={<EmojiHappyYellow className="mr-2 h-20 w-20" />}
                primaryMessage={`Wow, great job!`}
                secondaryMessage={`Take a bow, ${appName} pro!`}
                primaryTextColour="white"
                secondaryTextColour="white"
                backgroundColour="successMain"
                className="mt-4"
              />
              <div>
                <Divider dividerType="dashed" className="mt-4" />
                <Typography
                  className="mb-4 mt-4"
                  type={'h3'}
                  color="black"
                  text={`Get to the next level!`}
                />
                <div>
                  <StackedList
                    listItems={getPhase1StackedMenuList()}
                    type={'MenuList'}
                    className={'flex flex-col gap-3'}
                  ></StackedList>
                </div>
              </div>
            </>
          ) : null}

          {/* Phase 2 ------------------------------------------------------ */}
          {isPhase1Completed &&
          showPhase2Card &&
          pointsTotalForYear &&
          pointsTotalForYear > 0 ? (
            <ScoreCard
              className="mt-5 py-6"
              mainText={`${monthPoints} points`}
              currentPoints={monthPoints}
              maxPoints={pointsMax}
              barBgColour="white"
              barColour={
                percentageScore < 60
                  ? 'alertMain'
                  : percentageScore < 80
                  ? 'quatenary'
                  : 'successMain'
              }
              bgColour={
                percentageScore < 60
                  ? 'alertBg'
                  : percentageScore < 80
                  ? 'quatenaryBg'
                  : 'successBg'
              }
              textColour="black"
            />
          ) : null}

          {/* celebration card with no percentage score */}
          {isPhase1Completed && showPhase2Card && percentageScore === 0 ? (
            <div>{celebrationCard}</div>
          ) : null}

          {/* celebration card */}
          {isOnline &&
          isPhase1Completed &&
          showPhase2Card &&
          monthPoints > 0 &&
          pointsTotalForYear &&
          pointsTotalForYear > 0 ? (
            <CelebrationCard
              className="mt-3"
              image={getEmoji(
                pointsShareData?.userRankingData
                  ?.comparativeTargetPercentageColor!
              )}
              primaryMessage={
                pointsShareData?.userRankingData?.comparativePrimaryMessage!
              }
              secondaryMessage={
                pointsShareData?.userRankingData?.comparativeSecondaryMessage!
              }
              primaryTextColour={getTitleColor(
                pointsShareData?.userRankingData
                  ?.comparativeTargetPercentageColor!
              )}
              secondaryTextColour="black"
              backgroundColour={getBgColor(
                pointsShareData?.userRankingData
                  ?.comparativeTargetPercentageColor!
              )}
            />
          ) : null}

          {/* Text heading for earning more points */}
          {isPhase1Completed &&
          showPhase2Card &&
          pointsTotalForYear &&
          pointsTotalForYear > 0 ? (
            <Typography
              className="mb-4 mt-4"
              type={'h3'}
              color="black"
              text={`How you can earn more points in ${format(
                new Date(),
                'MMMM'
              )}:`}
            />
          ) : null}

          {/* Show items of how you can score - when in phase 2 and there are points for the year */}
          {!!todoListFiltered &&
          isPhase1Completed &&
          showPhase2Card &&
          pointsTotalForYear &&
          pointsTotalForYear > 0
            ? todoListFiltered?.slice(0, 3)?.map((item) => {
                return (
                  <div
                    key={item?.activity}
                    onClick={() =>
                      history.push(item?.href, {
                        activeTabIndex: item?.tabIndex,
                      })
                    }
                  >
                    <PointsTodoItem
                      text={item?.missingActivityText}
                      icon={item?.icon}
                    />
                  </div>
                );
              })
            : null}
        </div>

        {/* Share icon button - when phase 2 and there are month and year points */}
        <div className="flex-column mt-10 justify-end p-4">
          {isPhase1Completed &&
          showPhase2Card &&
          pointsTotalForYear &&
          pointsTotalForYear > 0 &&
          monthPoints > 0 ? (
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="quatenary"
              text="Share"
              textColor="white"
              icon="ShareIcon"
              onClick={() => {
                setShowPrintData(true);
                setTimeout(() => {
                  if (shareRef.current) {
                    captureAndDownloadComponent(
                      shareRef.current,
                      `points-month-summary-${format(new Date(), 'MMM-yyyy')}`
                    );
                    setShowPrintData(false);
                  }
                }, 100);
              }}
            />
          ) : null}

          {/* Button to find to show how to - when there is yearly points but no month points in phase 2 */}
          {isPhase1Completed &&
          showPhase2Card &&
          pointsTotalForYear &&
          pointsTotalForYear > 0 &&
          monthPoints === 0 &&
          !practitioner?.coachHierarchy ? (
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="quatenary"
              text="How to earn points"
              textColor="white"
              icon="QuestionMarkCircleIcon"
              onClick={() => setShowInfo(true)}
            />
          ) : null}

          {/* Button to ask coach help - when there is yearly points, no month points and assigned coach in phase 2 */}
          {isPhase1Completed &&
          showPhase2Card &&
          pointsTotalForYear &&
          pointsTotalForYear > 0 &&
          monthPoints === 0 &&
          practitioner?.coachHierarchy ? (
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="quatenary"
              text="Ask your coach for help"
              textColor="white"
              icon="ChatIcon"
              onClick={() => history.push(ROUTES.PRACTITIONER.CONTACT_COACH)}
            />
          ) : null}

          {/* Button to see detailed report - when in phase 2 and there are points for year */}
          {isPhase1Completed &&
          showPhase2Card &&
          pointsTotalForYear &&
          pointsTotalForYear > 0 ? (
            <Button
              size="normal"
              className="mb-4 w-full"
              type="outlined"
              color="quatenary"
              text="See detailed report"
              textColor="quatenary"
              icon="EyeIcon"
              onClick={handleSeeDetailedReport}
            />
          ) : null}
        </div>
      </BannerWrapper>
      <Dialog
        fullScreen={true}
        visible={showInfo}
        position={DialogPosition.Full}
      >
        <PointsInfoPage onClose={() => setShowInfo(false)} />
      </Dialog>
      <div ref={shareRef} style={{ display: showPrintData ? 'block' : 'none' }}>
        <PointsShare
          viewMode="Month"
          pointsTotal={String(pointsShareData?.total)}
          pointsSummaries={pointsShareData?.activityDetail as any}
          userFullName={
            practitioner?.user?.surname
              ? `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`
              : `${practitioner?.user?.firstName}`
          }
          childCount={pointsShareData?.totalChildren || 0}
        />
      </div>
    </>
  );
};
