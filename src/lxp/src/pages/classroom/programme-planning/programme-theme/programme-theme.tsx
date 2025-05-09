import {
  ProgrammeThemeDto,
  ProgrammeThemeDto as ProgrammeThemeModel,
  getAvatarColor,
  useDialog,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  Typography,
  DialogPosition,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { programmeThemeSelectors } from '@store/content/programme-theme';
import ROUTES from '@routes/routes';
import ProgrammeWrapper from '../programme-dashboard/walkthrough/programme-wrapper';
import { ProgrammeThemeRouteState } from './programme-theme.types';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '../../class-dashboard/class-dashboard.types';
import { classroomsSelectors } from '@/store/classroom';
import { ProgrammeTimingRouteState } from '../programme-timing/programme-timing.types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ProgrammeThemeActions } from '@/store/content/programme-theme/programme-theme.actions';
import { useAppContext } from '@/walkthrougContext';
import { dummyThemes } from '../programme-dashboard/walkthrough/dummy-content';

const ProgrammeTheme: React.FC = () => {
  const dialog = useDialog();

  const location = useLocation<ProgrammeThemeRouteState>();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const { setState, state } = useAppContext();

  const isWalkthrough = state?.run;
  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(location.state.classroomGroupId)
  );
  const programmeThemes = useSelector(
    programmeThemeSelectors.getProgrammeThemes
  );

  const themes = isWalkthrough ? dummyThemes : programmeThemes;

  const { isLoading } = useThunkFetchCall(
    'programmeThemeData',
    ProgrammeThemeActions.GET_PROGRAMME_THEMES
  );

  useEffect(() => {
    if (!location.state?.classroomGroupId) {
      history.push(ROUTES.CLASSROOM.ROOT, {
        activeTabIndex: TabsItems.ACTIVITES,
      } as ClassDashboardRouteState);
    }
  }, [history, location.state?.classroomGroupId]);

  const handleBack = () => {
    history.push(
      ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
        ':classroomGroupId',
        location.state.classroomGroupId
      )
    );
  };

  const handleDialog = () => {
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            title="Themes"
            icon={'InformationCircleIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'infoBb'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'primary',
                onClick: () => onSubmit(),
                type: 'filled',
                textColour: 'white',
                leadingIcon: 'XIcon',
              },
            ]}
          >
            <Typography
              type="markdown"
              fontSize={'16'}
              text={
                `It is helpful to plan your weeks or months by theme. Observe and listen to the children in your programme and choose themes that they are interested in.<br><br>
                We have provided ` +
                themes.length +
                ` themes with activities planned for 20 days.<br><br>
                You are welcome to change activities or create your own to match your children's interests, the time of the year, or other things happening around you.`
              }
              color={'textDark'}
              className="font-h1 text-textMid mb-2 text-center text-base font-normal"
            />
          </ActionModal>
        );
      },
    });
  };

  const [themeItems, setThemeItems] = useState<any[]>([]);

  const updateArrayItem = async (item: any) => {
    setThemeItems((oldArray) => [...oldArray, item]);
  };

  const setBase64String = async (imageUrl: string, index: number) => {
    if (isWalkthrough) {
      updateArrayItem(themes[0]);
      return;
    }

    const prefix =
      imageUrl.indexOf('.svg') !== -1
        ? 'data:image/svg+xml;base64,'
        : imageUrl.indexOf('.jpg') !== -1 || imageUrl.indexOf('.jpeg') !== -1
        ? 'data:image/jpg;base64,'
        : 'data:image/png;base64,';

    const base64 = await fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((res) => {
          reader.onloadend = () => {
            res(reader.result);
          };
        });
      });

    const base64String = base64 && base64.toString();

    const items = [...themes];
    const item = { ...items[index] };
    item.imageUrl = base64String!
      .toString()
      .replace('data:application/octet-stream;base64,', prefix);

    updateArrayItem(item);
  };

  useEffect(() => {
    if (themes.length !== 0) {
      themes.forEach((item, index) => {
        setBase64String(item.imageUrl, index);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themes]);

  const handelThemeSelected = (theme: ProgrammeThemeModel) => {
    setState({ stepIndex: 2 });
    history.push(ROUTES.PROGRAMMES.TIMING, {
      ...location.state,
      theme,
      classroomGroupId: classroomGroup?.id,
    } as ProgrammeTimingRouteState);
  };

  const themeList: UserAlertListDataItem[] = themeItems
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .map((theme: ProgrammeThemeDto) => ({
      title: theme.name,
      profileText: theme.name.slice(0, 2).toUpperCase(),
      alertSeverity: 'none',
      avatarColor: !!theme.color
        ? theme.color
        : !!theme.imageUrl
        ? 'transparent'
        : getAvatarColor(),
      profileDataUrl: theme.imageUrl,
      themeLogo: theme.themeLogo,
      hideAlertSeverity: true,
      onActionClick: () => handelThemeSelected(theme),
    }));

  return (
    <BannerWrapper
      isLoading={!isWalkthrough && isLoading}
      showBackground={false}
      size="medium"
      renderBorder={true}
      title="Choose a theme"
      color={'primary'}
      onBack={handleBack}
      displayHelp={true}
      onHelp={handleDialog}
      displayOffline={!isOnline}
      className="p-4 pt-6"
    >
      <ProgrammeWrapper />
      <Typography
        type="h1"
        text={`Choose a theme for ${classroomGroup?.name}`}
        color={'primary'}
        className="mb-4"
      />
      <div id="walkthrough-nature-theme">
        <StackedList
          className="flex flex-col gap-1"
          type="UserAlertList"
          listItems={themeList}
        />
      </div>
    </BannerWrapper>
  );
};

export default ProgrammeTheme;
