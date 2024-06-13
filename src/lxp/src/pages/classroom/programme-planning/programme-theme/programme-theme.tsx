import {
  ProgrammeThemeDto as ProgrammeThemeModel,
  useDialog,
} from '@ecdlink/core';
import {
  ActionModal,
  BannerWrapper,
  IconImageListItem,
  Typography,
  DialogPosition,
} from '@ecdlink/ui';
import React, { useEffect } from 'react';
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

const ProgrammeTheme: React.FC = () => {
  const dialog = useDialog();

  const location = useLocation<ProgrammeThemeRouteState>();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(location.state.classroomGroupId)
  );
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);

  useEffect(() => {
    if (!location.state?.classroomGroupId) {
      history.push(ROUTES.CLASSROOM.ROOT, {
        activeTabIndex: TabsItems.ACTIVITES,
      } as ClassDashboardRouteState);
    }
  }, [history, location.state?.classroomGroupId]);

  const handleBack = () => {
    history.push(
      ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.replace(
        ':classroomGroupId',
        location.state.classroomGroupId
      )
    );
  };

  const handleDialog = () => {
    dialog({
      position: DialogPosition.Bottom,
      render: (onSubmit, onCancel) => {
        return (
          <ActionModal
            importantText={`Themes`}
            detailText={`It is helpful to plan your weeks or months by theme. Observe and listen to the children in your programme and choose themes that they are interested in.\n
            We have provided 2 themes with activities planned for Mondays through Thursdays. Fridays are mahala days, so get creative and choose your own activities!\n
            You are welcome to change activities or create your own to match your children's interests, the time of the year, or other things happening around you.`}
            textAlignment="left"
            actionButtons={[
              {
                text: 'Close',
                textColour: 'white',
                colour: 'primary',
                type: 'filled',
                onClick: () => onSubmit(),
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const handelThemeSelected = (theme: ProgrammeThemeModel) => {
    history.push(ROUTES.PROGRAMMES.TIMING, {
      theme,
      classroomGroupId: classroomGroup?.id,
    } as ProgrammeTimingRouteState);
  };

  return (
    <BannerWrapper
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
      {themes?.map((theme, idx) => (
        <div
          className="mb-1 rounded-3xl"
          key={idx}
          id={theme.name === 'Nature tree' ? 'walkthrough-nature-theme' : ''}
        >
          <IconImageListItem
            key={`theme-item-${theme.id}`}
            color={theme.color}
            title={theme.name}
            icon={theme.imageUrl}
            showDivider={idx > 0}
            onClick={() => handelThemeSelected(theme)}
            backgroundColor={'uiBg'}
            borderRadius={'xl'}
          />
        </div>
      ))}
    </BannerWrapper>
  );
};

export default ProgrammeTheme;
