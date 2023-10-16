import { ContentConsentTypeEnum } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  ComponentBaseProps,
  StackedList,
  StackedListItemType,
  Typography,
  MenuListDataItem,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Article from '../../../../../components/article/article';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './programme-tutorial.styles';
import ROUTES from '@routes/routes';

interface ProgrammeTutorialProps extends ComponentBaseProps {
  listItems: StackedListItemType[];
  notification?: Notification;
}

export const ProgrammeTutorial: React.FC<ProgrammeTutorialProps> = ({
  listItems,
  notification,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const navigate = (route: string) => {
    history.push(route);
  };

  const [presentArticle, setPresentArticle] = useState<boolean>(false);

  const [notifications] = useState<MenuListDataItem[]>([
    {
      title: 'Developing children holistically',
      showIcon: true,
      onActionClick: () => {
        navigate(ROUTES.PROGRAMMES.TUTORIAL.DEVELOPING_CHILDREN);
      },
    },
    {
      title: 'Learning through play',
      showIcon: true,
      onActionClick: () => {
        setPresentArticle(true);
      },
    },
    {
      title: 'The daily routine',
      showIcon: true,
      onActionClick: () => {
        navigate(ROUTES.PROGRAMMES.TUTORIAL.DAILY_ROUTINE);
      },
    },
  ]);

  const startPlanning = () => {
    // ROUTE TO PROGRAMME CREATION
    history.replace(ROUTES.PROGRAMMES.THEME);
  };
  console.log('notifications', notifications);

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      title={'Programme best practices'}
      color={'primary'}
      onBack={() => history.push(ROUTES.CLASSROOM.ROOT, { activeTabIndex: 2 })}
      className={`${styles.bannerContentWrapper}`}
      backgroundColour="uiBg"
      displayOffline={!isOnline}
    >
      {!!notifications.length && (
        <StackedList
          type={'MenuList'}
          className={styles.stackedList}
          listItems={notifications}
        />
      )}

      <div className={'pt-2'}>
        <Button
          color={'primary'}
          type={'filled'}
          onClick={startPlanning}
          className={styles.closeButton}
        >
          <Typography
            color={'white'}
            type={'help'}
            weight={'normal'}
            text={'Start planning my programme'}
          />
        </Button>
      </div>

      <Article
        consentEnumType={ContentConsentTypeEnum.LearningThroughPlay}
        visible={presentArticle}
        title={'Learning through play'}
        onClose={() => setPresentArticle(false)}
        showClose={false}
      />
    </BannerWrapper>
  );
};

export default ProgrammeTutorial;
