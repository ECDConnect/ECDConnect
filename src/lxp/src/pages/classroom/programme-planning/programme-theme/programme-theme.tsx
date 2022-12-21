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
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { programmeThemeSelectors } from '@store/content/programme-theme';
import ROUTES from '@routes/routes';

const ProgrammeTheme: React.FC = () => {
  const dialog = useDialog();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const handleBack = () => {
    history.replace('/classroom', { activeTabIndex: 2 });
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

  const handleNoTheme = () => {
    history.push(ROUTES.PROGRAMMES.TIMING);
  };

  const handelThemeSelected = (theme: ProgrammeThemeModel) => {
    history.push(ROUTES.PROGRAMMES.TIMING, { theme });
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Programme themes'}
      color={'primary'}
      onBack={handleBack}
      displayHelp={true}
      onHelp={handleDialog}
      displayOffline={!isOnline}
    >
      <Typography
        className={'mx-4 my-2'}
        type="h1"
        text="Choose a theme"
        color={'primary'}
      />
      {themes?.map((theme, idx) => (
        <IconImageListItem
          key={`theme-item-${theme.id}`}
          color={theme.color}
          title={theme.name}
          icon={theme.imageUrl}
          showDivider={idx > 0}
          onClick={() => handelThemeSelected(theme)}
        />
      ))}
      <div className="mx-4 mt-4" onClick={handleNoTheme}>
        <Typography
          type="body"
          text="Or create your own programme →"
          color={'primary'}
        />
        <Typography type="body" text="No theme" color={'textLight'} />
      </div>
    </BannerWrapper>
  );
};

export default ProgrammeTheme;
