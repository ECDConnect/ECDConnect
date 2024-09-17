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
import { ReactComponent as EmojiHappyYellow } from '../../../assets/ECD_Connect_emoji3.svg';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '../../../assets/emoji_blue_smile_eye_open.svg';
import { ReactComponent as EmojiOrangeSmile } from '../../../assets/mehFace.svg';
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
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import { PermissionsNames } from '@/pages/principal/components/add-practitioner/add-practitioner.types';
import { BusinessTabItems } from '@/pages/business/business.types';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

export const PointsSummary: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const dialog = useDialog();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;
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

  const userStanding = useSelector(pointsSelectors.getCurrentClubStanding());
  // const pointsTotalForYear = useSelector(
  //   pointsSelectors.getPointsTotalForYear()
  // );
  const pointsTotalForYear = useSelector(pointsSelectors.getTotalYearPoints);

  const pointsShareData = useSelector(pointsSelectors.getPointsShareData);

  const getPointsToDoItems = useCallback(async () => {
    const response = dispatch(
      pointsThunkActions.pointsTodoItems({ userId: practitioner?.userId! })
    );
    return response;
  }, [dispatch, practitioner?.userId]);

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
    const response = await new PointsService(
      userAuth?.auth_token!
    ).yearPointsView(practitioner?.userId!);
    return response;
  }, [practitioner?.userId, userAuth?.auth_token]);

  const todoListFiltered = !practitioner?.isPrincipal
    ? pointActivitiesItems
        ?.filter((item) => item?.activity !== 'Income/expenses added')
        ?.filter((item2) =>
          attendancePermission?.isActive !== true
            ? item2?.activity !== 'Attendance registers saved'
            : item2
        )
        ?.filter((el) => {
          return pointsShareData?.activityDetail?.some((f: any) => {
            return f.activity !== el.activity;
          });
        })
    : pointActivitiesItems.filter((el) => {
        return pointsShareData?.activityDetail?.some((f: any) => {
          return f.activity !== el.activity;
        });
      });

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

      const pointsToDoValues = Object.values(newPointsToDo!)?.filter(
        (item) => item === true
      );
      return pointsToDoValues?.length;
    } else {
      return 0;
    }
  }, [pointsToDo, practitioner?.isPrincipal]);

  const renderTodoText = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      return 'Influencer';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'Boss';
    }

    if (
      (pointsToDo?.plannedOneDay && practitioner?.isPrincipal) ||
      (pointsToDo?.plannedOneDay &&
        !practitioner?.isPrincipal &&
        planActivitiesPermission?.isActive === true)
    ) {
      return 'Cwepheshe';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'Tichere';
    }
    if (pointsToDo?.signedUpForApp) {
      return 'Umtsha';
    }

    return 'Umtsha';
  }, [
    planActivitiesPermission?.isActive,
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoScoreCardBgColor = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (
        (getCurrentPointsToDo === 3 && practitioner?.isPrincipal) ||
        (!practitioner?.isPrincipal &&
          planActivitiesPermission?.isActive === true &&
          getCurrentPointsToDo === 3)
      ) {
        return 'quatenaryBg';
      }
      return 'successBg';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenaryBg';
    }

    if (
      pointsToDo?.plannedOneDay &&
      !practitioner?.isPrincipal &&
      planActivitiesPermission?.isActive === true
    ) {
      return 'quatenaryBg';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'secondaryAccent2';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertBg';
    }

    return 'alertBg';
  }, [
    getCurrentPointsToDo,
    planActivitiesPermission?.isActive,
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoEmoji = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (
        (getCurrentPointsToDo === 3 && practitioner?.isPrincipal) ||
        (!practitioner?.isPrincipal &&
          planActivitiesPermission?.isActive === true &&
          getCurrentPointsToDo === 3)
      ) {
        return (
          <div className="bg-quatenary mr-4 rounded-full p-3">
            <FireIcon className="font-white h-8  w-8 text-white" />
          </div>
        );
      }
      return (
        <div className="bg-successDark mr-4 rounded-full p-3">
          <FireIcon className="font-white h-8  w-8 text-white" />
        </div>
      );
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <Crown className="font-white h-8  w-8  text-white text-white" />
        </div>
      );
    }

    if (
      pointsToDo?.plannedOneDay &&
      !practitioner?.isPrincipal &&
      planActivitiesPermission?.isActive === true
    ) {
      return (
        <div className="bg-quatenary mr-4 rounded-full p-3">
          <CalendarIcon className="font-white h-8  w-8  text-white text-white" />
        </div>
      );
    }

    if (pointsToDo?.isPartOfPreschool) {
      return (
        <div className="bg-secondary mr-4 rounded-full p-3">
          <Kindgarden className="font-white h-8  w-8 text-white" />
        </div>
      );
    }
    if (pointsToDo?.signedUpForApp) {
      return (
        <div className="bg-alertMain mr-4 rounded-full p-2">
          <ClipboardCheckIcon className="font-white h-8  w-8 text-white" />
        </div>
      );
    }

    return (
      <div className="bg-alertMain mr-4 rounded-full p-2">
        <ClipboardCheckIcon className="font-white h-8  w-8 text-white" />
      </div>
    );
  }, [
    getCurrentPointsToDo,
    planActivitiesPermission?.isActive,
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const renderPointsToDoProgressBarColor = useMemo(() => {
    if (pointsToDo?.viewedCommunitySection) {
      if (
        (getCurrentPointsToDo === 3 && practitioner?.isPrincipal) ||
        (!practitioner?.isPrincipal &&
          planActivitiesPermission?.isActive === true &&
          getCurrentPointsToDo === 3)
      ) {
        return 'quatenary';
      }
      return 'successMain';
    }

    if (pointsToDo?.savedIncomeOrExpense && practitioner?.isPrincipal) {
      return 'quatenary';
    }

    if (
      pointsToDo?.plannedOneDay &&
      !practitioner?.isPrincipal &&
      planActivitiesPermission?.isActive === true
    ) {
      return 'quatenary';
    }

    if (pointsToDo?.isPartOfPreschool) {
      return 'secondary';
    }

    if (pointsToDo?.signedUpForApp) {
      return 'alertMain';
    }

    return 'alertMain';
  }, [
    getCurrentPointsToDo,
    planActivitiesPermission?.isActive,
    pointsToDo?.isPartOfPreschool,
    pointsToDo?.plannedOneDay,
    pointsToDo?.savedIncomeOrExpense,
    pointsToDo?.signedUpForApp,
    pointsToDo?.viewedCommunitySection,
    practitioner?.isPrincipal,
  ]);

  const practitionerWithAttendancePermissionPointsToDo =
    practitioner?.isPrincipal ||
    (!practitioner?.isPrincipal && planActivitiesPermission?.isActive === true)
      ? getCurrentPointsToDo < 4
      : getCurrentPointsToDo < 3;

  const practitionerWithAttendancePermissionPoints =
    practitioner?.isPrincipal ||
    (!practitioner?.isPrincipal && planActivitiesPermission?.isActive === true)
      ? getCurrentPointsToDo === 4
      : getCurrentPointsToDo === 3;

  function removeMandatoryProperty<T, K extends keyof T>(
    obj: T,
    prop: K,
    condition: (value: T[K]) => boolean
  ): void {
    if (condition(obj[prop])) {
      delete (obj as any)[prop]; // Use type assertion to bypass TypeScript checks
    }
  }

  const getStackedMenuList = (): MenuListDataItem[] => {
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-h1 font-normal text-textMid';

    const stackedMenuList: MenuListDataItem[] = [
      {
        id: '1',
        title: `Umtsha`,
        titleStyle: pointsToDo?.signedUpForApp
          ? 'text-successDark'
          : 'text-white',
        subTitle: `Sign up for ${appName}`,
        subTitleStyle: pointsToDo?.signedUpForApp
          ? 'text-successDark'
          : 'text-white',
        className: !pointsToDo?.signedUpForApp ? '' : 'px-2',
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
        id: '2',
        title: 'Tichere',
        titleStyle: pointsToDo?.isPartOfPreschool
          ? 'text-successDark'
          : titleStyle,
        subTitle: 'Set up or join your preschool',
        subTitleStyle: pointsToDo?.isPartOfPreschool
          ? 'text-successDark'
          : subTitleStyle,
        className:
          pointsToDo?.signedUpForApp && !pointsToDo?.isPartOfPreschool
            ? ''
            : 'px-2',
        menuIcon: pointsToDo?.isPartOfPreschool ? 'CheckIcon' : '',
        customIcon:
          pointsToDo?.signedUpForApp && !pointsToDo?.isPartOfPreschool ? (
            <Kindgarden
              className={`${
                pointsToDo?.isPartOfPreschool
                  ? `bg-successMain text-white`
                  : 'text-quatenary bg-quatenary'
              } z-50 mr-4 h-12 w-12 rounded-full p-2`}
            />
          ) : undefined,
        iconBackgroundColor: pointsToDo?.isPartOfPreschool
          ? 'successMain'
          : 'quatenary',
        showIcon: true,
        iconColor: 'white',
        hideRightIcon: true,
        backgroundColor: pointsToDo?.isPartOfPreschool
          ? 'successBg'
          : pointsToDo?.signedUpForApp
          ? 'quatenaryBg'
          : 'adminPortalBg',
        onActionClick:
          pointsToDo?.signedUpForApp &&
          !pointsToDo?.isPartOfPreschool &&
          practitioner?.isPrincipal
            ? () => history.push(ROUTES.PRINCIPAL.SETUP_PROFILE)
            : pointsToDo?.signedUpForApp &&
              !pointsToDo?.isPartOfPreschool &&
              !practitioner?.isPrincipal
            ? () => history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)
            : () => {},
      },
      {
        id: '3',
        title: practitioner?.isPrincipal ? 'Boss' : 'Cwepheshe',
        titleStyle:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
            ? 'text-successDark'
            : titleStyle,
        subTitle: practitioner?.isPrincipal
          ? 'Add income/expense'
          : 'Plan your daily routine',
        subTitleStyle:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
            ? 'text-successDark'
            : subTitleStyle,
        className:
          pointsToDo?.isPartOfPreschool &&
          !pointsToDo?.savedIncomeOrExpense &&
          !pointsToDo?.savedIncomeOrExpense
            ? ''
            : 'px-2',
        menuIcon:
          (practitioner?.isPrincipal && pointsToDo?.savedIncomeOrExpense) ||
          (!practitioner?.isPrincipal && pointsToDo?.plannedOneDay)
            ? 'CheckIcon'
            : !practitioner?.isPrincipal && !pointsToDo?.plannedOneDay
            ? 'CalendarIcon'
            : '',
        customIcon:
          pointsToDo?.signedUpForApp &&
          practitioner?.isPrincipal &&
          !pointsToDo?.savedIncomeOrExpense &&
          !pointsToDo?.plannedOneDay ? (
            <Crown
              className={`${
                pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
                  ? 'bg-successMain'
                  : !pointsToDo?.isPartOfPreschool
                  ? `bg-uiLight text-white`
                  : 'text-quatenary bg-quatenary'
              } z-50 mr-4 h-12 w-12 rounded-full p-2`}
            />
          ) : undefined,
        iconBackgroundColor:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
            ? 'successMain'
            : !pointsToDo?.isPartOfPreschool
            ? 'uiLight'
            : 'quatenary',
        showIcon: true,
        iconColor: 'white',
        hideRightIcon: true,
        backgroundColor:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
            ? 'successBg'
            : pointsToDo?.isPartOfPreschool
            ? 'quatenaryBg'
            : 'adminPortalBg',
        onActionClick:
          pointsToDo?.isPartOfPreschool &&
          !pointsToDo?.savedIncomeOrExpense &&
          !pointsToDo?.savedIncomeOrExpense &&
          practitioner?.isPrincipal
            ? () =>
                history.push(ROUTES.BUSINESS, {
                  activeTabIndex: BusinessTabItems.MONEY,
                })
            : pointsToDo?.isPartOfPreschool &&
              !pointsToDo?.savedIncomeOrExpense &&
              !pointsToDo?.savedIncomeOrExpense &&
              !practitioner?.isPrincipal
            ? () =>
                history.push(ROUTES.CLASSROOM.ROOT, {
                  activeTabIndex: TabsItems.ACTIVITES,
                })
            : () => {},
      },
      {
        id: '4',
        title: `Influencer`,
        titleStyle: pointsToDo?.viewedCommunitySection
          ? 'text-successDark'
          : titleStyle,
        subTitle: `Explore the community`,
        subTitleStyle: pointsToDo?.viewedCommunitySection
          ? 'text-successDark'
          : subTitleStyle,
        className:
          (pointsToDo?.savedIncomeOrExpense ||
            pointsToDo?.savedIncomeOrExpense ||
            (!practitioner?.isPrincipal &&
              planActivitiesPermission?.isActive === false &&
              pointsToDo?.isPartOfPreschool)) &&
          !pointsToDo?.viewedCommunitySection
            ? ''
            : 'px-2',
        menuIcon: pointsToDo?.viewedCommunitySection ? 'CheckIcon' : 'FireIcon',
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        menuIconClassName: `${
          pointsToDo?.viewedCommunitySection
            ? 'bg-successMain'
            : pointsToDo?.savedIncomeOrExpense ||
              pointsToDo?.savedIncomeOrExpense ||
              (!practitioner?.isPrincipal &&
                (planActivitiesPermission?.isActive === false ||
                  planActivitiesPermission?.isActive === undefined) &&
                pointsToDo?.isPartOfPreschool)
            ? 'quatenary'
            : 'bg-uiLight'
        } rounded-full h-12 w-12 p-2.5`,
        showIcon: true,
        onActionClick:
          pointsToDo?.savedIncomeOrExpense ||
          pointsToDo?.savedIncomeOrExpense ||
          (!practitioner?.isPrincipal &&
            (planActivitiesPermission?.isActive === false ||
              planActivitiesPermission?.isActive === undefined) &&
            !pointsToDo?.viewedCommunitySection)
            ? () => history.push(ROUTES.COMMUNITY.WELCOME)
            : () => {},
        hideRightIcon: true,
        backgroundColor: pointsToDo?.viewedCommunitySection
          ? 'successBg'
          : pointsToDo?.savedIncomeOrExpense ||
            pointsToDo?.savedIncomeOrExpense ||
            (!practitioner?.isPrincipal &&
              (planActivitiesPermission?.isActive === false ||
                planActivitiesPermission?.isActive === undefined) &&
              pointsToDo?.isPartOfPreschool)
          ? 'quatenaryBg'
          : 'adminPortalBg',
      },
    ];

    return stackedMenuList;
  };

  const getSecondaryStackedMenuList = (): MenuListDataItem[] => {
    const titleStyle = 'text-textDark font-semibold text-base leading-snug';
    const subTitleStyle = 'text-sm font-h1 font-normal text-textMid';

    const stackedMenuList: MenuListDataItem[] = [
      {
        id: '1',
        title: `Umtsha`,
        titleStyle: pointsToDo?.signedUpForApp
          ? 'text-successDark'
          : titleStyle,
        subTitle: `Sign up for ${appName}`,
        subTitleStyle: pointsToDo?.signedUpForApp
          ? 'text-successDark'
          : subTitleStyle,
        className: !pointsToDo?.signedUpForApp ? '' : 'px-2',
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
        id: '2',
        title: 'Tichere',
        titleStyle: pointsToDo?.isPartOfPreschool
          ? 'text-successDark'
          : titleStyle,
        subTitle: 'Set up or join your preschool',
        subTitleStyle: pointsToDo?.isPartOfPreschool
          ? 'text-successDark'
          : subTitleStyle,
        className:
          pointsToDo?.signedUpForApp && !pointsToDo?.isPartOfPreschool
            ? ''
            : 'px-2',
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
          ? 'successMain'
          : 'quatenary',
        showIcon: true,
        iconColor: 'white',
        hideRightIcon: true,
        backgroundColor: pointsToDo?.isPartOfPreschool
          ? 'successBg'
          : 'adminPortalBg',
        onActionClick:
          pointsToDo?.signedUpForApp &&
          !pointsToDo?.isPartOfPreschool &&
          practitioner?.isPrincipal
            ? pointsToDo?.signedUpForApp &&
              !pointsToDo?.isPartOfPreschool &&
              !practitioner?.isPrincipal
              ? () => history.push(ROUTES.PRINCIPAL.SETUP_PROFILE)
              : () => history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)
            : () => {},
      },
      {
        id: '4',
        title: `Influencer`,
        titleStyle: pointsToDo?.viewedCommunitySection
          ? 'text-successDark'
          : titleStyle,
        subTitle: `Explore the community`,
        subTitleStyle: pointsToDo?.viewedCommunitySection
          ? 'text-successDark'
          : subTitleStyle,
        className:
          (pointsToDo?.savedIncomeOrExpense ||
            pointsToDo?.savedIncomeOrExpense) &&
          !pointsToDo?.viewedCommunitySection
            ? ''
            : 'px-2',
        menuIcon: pointsToDo?.viewedCommunitySection ? 'CheckIcon' : 'FireIcon',
        iconBackgroundColor: 'quatenary',
        iconColor: 'white',
        menuIconClassName: `${
          pointsToDo?.viewedCommunitySection ? 'bg-successMain' : 'bg-uiLight'
        } rounded-full h-12 w-12 p-2.5`,
        showIcon: true,
        onActionClick: () => {},
        hideRightIcon: true,
        backgroundColor: pointsToDo?.viewedCommunitySection
          ? 'successBg'
          : pointsToDo?.savedIncomeOrExpense ||
            pointsToDo?.plannedOneDay ||
            (!practitioner?.isPrincipal &&
              planActivitiesPermission?.isActive === false &&
              pointsToDo?.isPartOfPreschool)
          ? 'quatenaryBg'
          : 'adminPortalBg',
      },
      {
        id: '3',
        title: practitioner?.isPrincipal ? 'Boss' : 'Cwepheshe',
        titleStyle:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
            ? 'text-successDark'
            : titleStyle,
        subTitle: practitioner?.isPrincipal
          ? 'Add income/expense'
          : 'Plan your daily routine',
        subTitleStyle:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
            ? 'text-successDark'
            : subTitleStyle,
        className:
          pointsToDo?.isPartOfPreschool &&
          !pointsToDo?.savedIncomeOrExpense &&
          !pointsToDo?.savedIncomeOrExpense
            ? ''
            : 'px-2',
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
                  : pointsToDo?.savedIncomeOrExpense
                  ? 'text-quatenary bg-successMain'
                  : 'text-quatenary bg-quatenary'
              } z-50 mr-4 h-12 w-12 rounded-full p-2`}
            />
          ) : undefined,
        iconBackgroundColor:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.plannedOneDay
            ? 'successBg'
            : !pointsToDo?.isPartOfPreschool
            ? 'uiLight'
            : 'quatenary',
        showIcon: true,
        iconColor: 'white',
        hideRightIcon: true,
        backgroundColor:
          pointsToDo?.savedIncomeOrExpense || pointsToDo?.savedIncomeOrExpense
            ? 'successBg'
            : pointsToDo?.isPartOfPreschool
            ? 'quatenaryBg'
            : 'adminPortalBg',
        onActionClick:
          pointsToDo?.isPartOfPreschool &&
          !pointsToDo?.savedIncomeOrExpense &&
          !pointsToDo?.savedIncomeOrExpense &&
          practitioner?.isPrincipal
            ? () => history.push(ROUTES.BUSINESS)
            : pointsToDo?.isPartOfPreschool &&
              !pointsToDo?.savedIncomeOrExpense &&
              !pointsToDo?.savedIncomeOrExpense &&
              !practitioner?.isPrincipal
            ? () =>
                history.push(ROUTES.CLASSROOM.ROOT, {
                  activeTabIndex: TabsItems.ACTIVITES,
                })
            : () => {},
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
          {(practitionerWithAttendancePermissionPointsToDo ||
            !pointsTotalForYear ||
            (pointsTotalForYear && pointsTotalForYear < 10)) && (
            <NoPointsScoreCard
              image={renderPointsToDoEmoji}
              className="mt-5 py-6"
              mainText={renderTodoText}
              currentPoints={getCurrentPointsToDo}
              maxPoints={
                practitioner?.isPrincipal ||
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
          )}
          {(!pointsTotalForYear ||
            (pointsTotalForYear && pointsTotalForYear < 10)) &&
          pointsToDo?.viewedCommunitySection &&
          getCurrentPointsToDo === 4 ? (
            <CelebrationCard
              image={<EmojiHappyYellow className="mr-2 h-20 w-20" />}
              primaryMessage={`Wow, great job!`}
              secondaryMessage={`Take a bow, ${appName} pro!`}
              primaryTextColour="white"
              secondaryTextColour="white"
              backgroundColour="successMain"
              className="mt-4"
            />
          ) : null}
          {practitionerWithAttendancePermissionPoints &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 ? (
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
          {!isOnline &&
          monthPoints &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 &&
          getCurrentPointsToDo === 4 ? (
            <div>{celebrationCard}</div>
          ) : null}
          {isOnline &&
          monthPoints &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 &&
          practitionerWithAttendancePermissionPoints ? (
            <CelebrationCard
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
          {!pointsTotalForYear ||
          pointsTotalForYear < 10 ||
          practitionerWithAttendancePermissionPointsToDo ? (
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
                  listItems={
                    getCurrentPointsToDo === 3 &&
                    pointsToDo?.viewedCommunitySection
                      ? practitioner?.isPrincipal ||
                        (!practitioner?.isPrincipal &&
                          planActivitiesPermission?.isActive === true)
                        ? getSecondaryStackedMenuList()
                        : getSecondaryStackedMenuList()?.filter(
                            (item) => item?.id !== '3'
                          )
                      : practitioner?.isPrincipal ||
                        (!practitioner?.isPrincipal &&
                          planActivitiesPermission?.isActive === true)
                      ? getStackedMenuList()
                      : getStackedMenuList()?.filter((item) => item?.id !== '3')
                  }
                  type={'MenuList'}
                  className={'-mt-0.5 flex flex-col gap-1.5'}
                ></StackedList>
              </div>
            </div>
          ) : null}
          {!!todoListFiltered &&
          !!todoListFiltered.length &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 &&
          practitionerWithAttendancePermissionPoints ? (
            <Typography
              className="mt-8 mb-4"
              type={'h3'}
              color="black"
              text={`How you can earn more points in ${format(
                new Date(),
                'MMMM'
              )}:`}
            />
          ) : null}
          {!!todoListFiltered &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 &&
          practitionerWithAttendancePermissionPoints
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
        <div className="flex-column mt-10 justify-end p-4">
          {practitionerWithAttendancePermissionPoints &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 &&
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
                      'points-month-summary.jpg'
                    );
                    setShowPrintData(false);
                  }
                }, 100);
              }}
            />
          ) : null}
          {practitionerWithAttendancePermissionPoints &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 &&
          monthPoints === 0 &&
          !practitioner?.coachHierarchy ? (
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
          ) : null}
          {practitionerWithAttendancePermissionPoints &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 &&
          monthPoints === 0 &&
          practitioner?.coachHierarchy ? (
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
          ) : null}
          {practitionerWithAttendancePermissionPoints &&
          pointsTotalForYear &&
          pointsTotalForYear >= 10 ? (
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
          clubStanding={
            userStanding?.percentageMembersWithFewerPointsForCurrentMonth || 0
          }
          clubName={practitioner?.clubName || 'Unknown Club'}
        />
      </div>
    </>
  );
};
