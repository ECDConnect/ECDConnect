import {
  pointActivitiesItems,
  pointsActivitiesIds,
  pointsConstants,
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
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '../../../assets/mehFace.svg';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PointsSummaryDto, captureAndDownloadComponent } from '@ecdlink/core';
import ROUTES from '@/routes/routes';
import { PointsShare } from '../points-share/points-share';
import { PointsInfoPage } from '../info/points-info-page';
import { PointsService } from '@/services/PointsService';
import { authSelectors } from '@/store/auth';
import { PointsTodoItem } from './components/points-todo-item/points-todo-item';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import {
  CalendarIcon,
  ClipboardCheckIcon,
  FireIcon,
} from '@heroicons/react/solid';
import { ReactComponent as Kindgarden } from '@/assets//icon/kindergarten1.svg';
import { ReactComponent as Crown } from '@/assets//icon/crown.svg';
import { useTenant } from '@/hooks/useTenant';
import { pointsTodoItems } from '@/store/points/points.actions';

export const PointsSummary: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [showInfo, setShowInfo] = useState(false);
  const pointsToDo = useSelector(pointsSelectors.getPointsToDo);
  console.log({ pointsToDo });
  const pointsSummaryDataWithLibrary = useSelector(
    pointsSelectors.getPointsSummaryWithLibrary(new Date())
  );
  const monthPoints = useSelector(pointsSelectors.getMonthPointsSummary);

  const userStanding = useSelector(pointsSelectors.getCurrentClubStanding());
  const pointsTotalForYear = useSelector(
    pointsSelectors.getPointsTotalForYear()
  );
  console.log({ pointsTotalForYear });
  const filteredPointsSummaries = pointsSummaryDataWithLibrary?.filter(
    (x) => x.pointsTotal > 0
  );
  const [pointsShareData, setPointsShareData] = useState<any>();

  const getPointsToDoItems = useCallback(async () => {
    const response = dispatch(
      pointsThunkActions.pointsTodoItems({ userId: practitioner?.userId! })
    );
    return response;
  }, [dispatch, practitioner?.userId]);

  const getshareData = useCallback(async () => {
    const response = await new PointsService(userAuth?.auth_token!).sharedData(
      practitioner?.userId!,
      true
    );
    setPointsShareData(response);
    return response;
  }, [practitioner?.userId, userAuth?.auth_token]);

  const getYearPoints = useCallback(async () => {
    const response = await new PointsService(
      userAuth?.auth_token!
    ).yearPointsView(practitioner?.userId!);
    return response;
  }, [practitioner?.userId, userAuth?.auth_token]);

  const todoItems = pointActivitiesItems?.filter((item) => {
    return pointsShareData?.activityDetail?.includes(item?.activity);
  });

  const todoListFiltered = pointActivitiesItems.filter((el) => {
    return pointsShareData?.activityDetail.some((f: any) => {
      return f.activity !== el.activity;
    });
  });

  const renderTodoText = useMemo(() => {
    if (pointsToDo?.signedUpForApp) {
      return 'Umtsha';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'Tichere';
    }
    if (pointsToDo?.viewedCommunitySection) {
      return 'Influencer';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'Boss';
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return 'Cwepheshe';
    }

    return 'Umtsha';
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoScoreCardBgColor = useMemo(() => {
    if (pointsToDo?.signedUpForApp) {
      return 'alertBg';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'secondaryAccent2';
    }
    if (pointsToDo?.viewedCommunitySection) {
      return 'successBg';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenaryBg';
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return 'quatenaryBg';
    }

    return 'alertBg';
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoEmoji = useMemo(() => {
    if (pointsToDo?.signedUpForApp) {
      return (
        <div className="bg-alertMain mr-4 rounded-full p-2">
          <ClipboardCheckIcon className="font-white h-8 w-8" />
        </div>
      );
    }

    if (pointsToDo?.isPartOfPreschool) {
      return (
        <div className="bg-secondary mr-4 rounded-full p-3">
          <Kindgarden className="font-white h-8 w-8" />
        </div>
      );
    }
    if (pointsToDo?.viewedCommunitySection) {
      return (
        <div className="bg-successMain mr-4 rounded-full p-3">
          <FireIcon className="font-white h-8 w-8" />
        </div>
      );
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <Crown className="font-white h-8 w-8" />
        </div>
      );
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <CalendarIcon className="font-white h-8 w-8" />
        </div>
      );
    }

    return (
      <div className="bg-alertMain mr-4 rounded-full p-2">
        <ClipboardCheckIcon className="font-white h-8 w-8" />
      </div>
    );
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoProgressBarColor = useMemo(() => {
    if (pointsToDo?.signedUpForApp) {
      return 'alertMain';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'secondary';
    }
    if (pointsToDo?.viewedCommunitySection) {
      return 'successMain';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenary';
    }

    if (pointsToDo?.plannedOneDay && !practitioner?.isPrincipal) {
      return 'quatenary';
    }

    return 'alertMain';
  }, [
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  function removeMandatoryProperty<T, K extends keyof T>(
    obj: T,
    prop: K,
    condition: (value: T[K]) => boolean
  ): void {
    if (condition(obj[prop])) {
      delete (obj as any)[prop]; // Use type assertion to bypass TypeScript checks
    }
  }

  const getCurrentPointsToDo = useMemo(() => {
    if (pointsToDo) {
      let newPointsToDo = { ...pointsToDo };
      if (practitioner?.isPrincipal) {
        removeMandatoryProperty(
          newPointsToDo,
          'plannedOneDay',
          (value) => practitioner?.isPrincipal === true
        );
      } else {
        removeMandatoryProperty(
          newPointsToDo,
          'savedIncomeOrExpense',
          (value) => !practitioner?.isPrincipal
        );
      }

      console.log({ newPointsToDo });
      const pointsToDoValues = Object.values(newPointsToDo!)?.filter(
        (item) => item === true
      );
      return pointsToDoValues?.length;
    } else {
      return 0;
    }
  }, [pointsToDo, practitioner?.isPrincipal]);
  console.log(pointsToDo?.isPartOfPreschool);
  const getStackedMenuList = (): MenuListDataItem[] => {
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-h1 font-normal text-textMid';

    const stackedMenuList: MenuListDataItem[] = [
      {
        title: `Umtsha`,
        titleStyle,
        subTitle: `Sign up for ${appName}`,
        subTitleStyle,
        menuIcon: pointsToDo?.signedUpForApp
          ? 'CheckIcon'
          : 'ClipboardCheckIcon',
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        menuIconClassName: 'bg-successMain rounded-full h-12 w-12 p-2.5',
        backgroundColor: 'successBg',
        showIcon: true,
        onActionClick: () => {},
        hideRightIcon: true,
      },
      {
        title: 'Tichere',
        titleStyle,
        subTitle: 'Set up or join your preschool',
        subTitleStyle,
        menuIcon: pointsToDo?.isPartOfPreschool ? 'CheckIcon' : '',
        customIcon:
          pointsToDo?.signedUpForApp && !pointsToDo?.isPartOfPreschool ? (
            <Kindgarden
              className={`${
                pointsToDo?.isPartOfPreschool
                  ? `bg-successMain text-white`
                  : 'text-quatenary bg-white'
              } z-50 mr-4 h-12 w-12 rounded-full p-2`}
            />
          ) : undefined,
        iconBackgroundColor: pointsToDo?.isPartOfPreschool
          ? 'successBg'
          : 'quatenary',
        showIcon: true,
        iconColor: 'white',
        hideRightIcon: true,
      },
      {
        title: practitioner?.isPrincipal ? 'Boss' : 'Cwepheshe',
        titleStyle,
        subTitle: practitioner?.isPrincipal
          ? 'Add income/expense'
          : 'Plan your daily routine',
        subTitleStyle,
        menuIcon:
          (practitioner?.isPrincipal && pointsToDo?.savedIncomeOrExpense) ||
          (!practitioner?.isPrincipal && pointsToDo?.plannedOneDay)
            ? 'CheckIcon'
            : !practitioner?.isPrincipal && !pointsToDo?.plannedOneDay
            ? 'CalendarIcon'
            : '',
        customIcon:
          pointsToDo?.signedUpForApp && practitioner?.isPrincipal ? (
            <Crown
              className={`${
                !pointsToDo?.isPartOfPreschool
                  ? `bg-uiLight text-white`
                  : 'text-quatenary bg-white'
              } z-50 mr-4 h-12 w-12 rounded-full p-2`}
            />
          ) : undefined,
        iconBackgroundColor: pointsToDo?.isPartOfPreschool
          ? 'successBg'
          : 'quatenary',
        showIcon: true,
        iconColor: 'white',
        hideRightIcon: true,
      },
      {
        title: `Influencer`,
        titleStyle,
        subTitle: `Sign up for ${appName}`,
        subTitleStyle,
        menuIcon: pointsToDo?.viewedCommunitySection ? 'CheckIcon' : 'FireIcon',
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        menuIconClassName: 'bg-successMain rounded-full h-12 w-12 p-2.5',
        backgroundColor: 'successBg',
        showIcon: true,
        onActionClick: () => {},
        hideRightIcon: true,
      },
    ];

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
        (practitioner?.isPrincipal || practitioner?.isFundaAppAdmin)
      ) {
        pointsList.push(pointsActivity);
      }
    });

    return pointsList;
  }, [
    pointsSummaryDataWithLibrary,
    practitioner?.isFundaAppAdmin,
    practitioner?.isPrincipal,
  ]);

  const pointsTotal = pointsSummaryDataWithLibrary?.reduce(
    (total, current) => (total += current.pointsTotal),
    0
  );
  let pointsMax =
    isPrincipal || isFundaAppAdmin
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
    if (!!userStanding) {
      if (monthPoints === 100) {
        return (
          <CelebrationCard
            image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Wow, well done ${practitioner?.user?.firstName}!`}
            secondaryMessage="You are the top points earner in your club! Keep it up!"
            primaryTextColour="successMain"
            secondaryTextColour="black"
            backgroundColour="successBg"
          />
        );
      }
      if (monthPoints > 75) {
        return (
          <CelebrationCard
            image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Wow, well done ${practitioner?.user?.firstName}!`}
            secondaryMessage="You are one of the top points earners in your club! Keep it up!"
            primaryTextColour="successMain"
            secondaryTextColour="black"
            backgroundColour="successBg"
          />
        );
      }
      if (monthPoints >= 50) {
        return (
          <CelebrationCard
            image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Good job ${practitioner?.user?.firstName}!`}
            secondaryMessage="You have more points than most other SmartStarters in your club!"
            primaryTextColour="secondary"
            secondaryTextColour="black"
            backgroundColour="infoBb"
          />
        );
      }
      if (monthPoints > 50) {
        return (
          <CelebrationCard
            image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
            primaryTextColour="alertMain"
            backgroundColour="alertBg"
            secondaryMessage={`Most of the SmartStarters in your club have more than ${pointsTotalForYear} points! Earn more points to join them.`}
            secondaryTextColour="black"
          />
        );
      }
    }

    if (percentageScore < 60) {
      return (
        <CelebrationCard
          image={<EmojiOrangeSmile className="mr-2 h-20 w-20" />}
          primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
          primaryTextColour="alertMain"
          backgroundColour="alertBg"
          secondaryMessage="Check out the tips below to earn more points this month."
          secondaryTextColour="black"
        />
      );
    } else if (percentageScore < 80) {
      return (
        <CelebrationCard
          image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Wow, great job ${practitioner?.user?.firstName}!`}
          secondaryMessage="You're doing well, keep it up! You can still earn more points this month."
          primaryTextColour="secondary"
          secondaryTextColour="black"
          backgroundColour="infoBb"
        />
      );
    } else {
      return (
        <CelebrationCard
          image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Well done ${practitioner?.user?.firstName}!`}
          secondaryMessage="You're doing well, keep it up!"
          primaryTextColour="successMain"
          secondaryTextColour="black"
          backgroundColour="successBg"
        />
      );
    }
  }, [
    monthPoints,
    percentageScore,
    pointsTotalForYear,
    practitioner?.user?.firstName,
    userStanding,
  ]);

  // SHARE LOGIC
  const shareRef = useRef<HTMLDivElement>(null);
  const [showPrintData, setShowPrintData] = useState(false);

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
            text={format(new Date(), 'MMM yyyy')}
          />
          {!pointsTotalForYear && (
            <NoPointsScoreCard
              image={renderPointsToDoEmoji}
              className="mt-5 py-6"
              mainText={renderTodoText}
              currentPoints={getCurrentPointsToDo}
              maxPoints={4}
              barBgColour="white"
              barColour={renderPointsToDoProgressBarColor}
              bgColour={renderPointsToDoScoreCardBgColor}
              textColour="black"
              isBigTitle={false}
            />
          )}
          {pointsTotalForYear && (
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
          )}
          {!isOnline && monthPoints && !pointsShareData && celebrationCard}
          {isOnline && monthPoints && (
            <CelebrationCard
              image={getEmoji(
                pointsShareData?.userRankingData
                  ?.comparativeTargetPercentageColor
              )}
              primaryMessage={
                pointsShareData?.userRankingData?.comparativePrimaryMessage
              }
              secondaryMessage={
                pointsShareData?.userRankingData?.comparativeSecondaryMessage
              }
              primaryTextColour={getTitleColor(
                pointsShareData?.userRankingData
                  ?.comparativeTargetPercentageColor
              )}
              secondaryTextColour="black"
              backgroundColour={getBgColor(
                pointsShareData?.userRankingData
                  ?.comparativeTargetPercentageColor
              )}
            />
          )}
          {!pointsTotalForYear && (
            <div>
              <Divider dividerType="dashed" />
              <Typography
                className="mt-4 mb-4"
                type={'h3'}
                color="black"
                text={`Get to the next level!`}
              />
              <div>
                <StackedList
                  listItems={getStackedMenuList()}
                  type={'MenuList'}
                  className={'-mt-0.5 flex flex-col gap-1.5 px-4'}
                ></StackedList>
              </div>
            </div>
          )}
          {!!todoListFiltered &&
            !!todoListFiltered.length &&
            pointsTotalForYear && (
              <Typography
                className="mt-8 mb-4"
                type={'h3'}
                color="black"
                text={`How you can earn more points in ${format(
                  new Date(),
                  'MMMM'
                )}:`}
              />
            )}
          {/* {!!pointsTodoList &&
            pointsTodoList.map((pointsLibraryScore, index) => {
              return (
                <PointsProgressCard
                  key={'points_' + index}
                  currentPoints={pointsLibraryScore.pointsTotal}
                  maxPoints={
                    pointsLibraryScore.maxMonthlyPoints !== 0
                      ? pointsLibraryScore.maxMonthlyPoints
                      : pointsLibraryScore.maxYearlyPoints
                  }
                  description={pointsLibraryScore.todoDescription || 'Unknown'}
                  badgeImage={
                    <Badge
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                      fill="var(--primary)"
                    />
                  }
                />
              );
            })} */}
          {!!todoListFiltered &&
            pointsTotalForYear &&
            todoListFiltered?.slice(0, 3)?.map((item) => {
              return (
                <PointsTodoItem
                  text={item?.missingActivityText}
                  icon={item?.icon}
                />
              );
            })}
        </div>
        <div className="flex-column mt-10 justify-end p-4">
          {pointsTotalForYear && monthPoints > 0 && (
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
                      'points-month-summary.jpg'
                    );
                    setShowPrintData(false);
                  }
                }, 100);
              }}
            />
          )}
          {pointsTotalForYear &&
            monthPoints === 0 &&
            !practitioner?.coachHierarchy && (
              <Button
                size="normal"
                className="mb-4 w-full"
                type="filled"
                color="quatenary"
                text="Find out how you can earn points"
                textColor="white"
                icon="LightBulbIcon"
                onClick={() => setShowInfo(true)}
              />
            )}
          {pointsTotalForYear &&
            monthPoints === 0 &&
            practitioner?.coachHierarchy && (
              <Button
                size="normal"
                className="mb-4 w-full"
                type="outlined"
                color="quatenary"
                text="Ask your coach for help"
                textColor="white"
                icon="ChatIcon"
                onClick={() => history.push(ROUTES.PRACTITIONER.CONTACT_COACH)}
              />
            )}
          {pointsTotalForYear && (
            <Button
              size="normal"
              className="mb-4 w-full"
              type="outlined"
              color="quatenary"
              text="See detailed report"
              textColor="quatenary"
              icon="EyeIcon"
              disabled={!isOnline}
              onClick={() =>
                history.push(ROUTES.PRACTITIONER.POINTS.YEAR, {
                  userRankingData: pointsShareData?.userRankingData,
                })
              }
            />
          )}
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
          pointsTotal={pointsShareData?.total}
          pointsSummaries={pointsShareData?.activityDetail}
          userFullName={
            practitioner?.user?.surname
              ? `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`
              : `${practitioner?.user?.firstName}`
          }
          childCount={pointsShareData?.totalChildren || 0}
          clubStanding={
            userStanding?.percentageMembersWithFewerPointsForCurrentMonth || 0
          }
          clubName={practitioner?.clubName || 'Unknown Club'}
        />
      </div>
    </>
  );
};
