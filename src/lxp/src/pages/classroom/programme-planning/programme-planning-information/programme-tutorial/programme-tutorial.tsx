import { ContentConsentTypeEnum } from '@ecdlink/core';
import { BannerWrapper, Button, StackedList, Typography } from '@ecdlink/ui';
import { MenuListDataItem } from '@ecdlink/ui';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Article from '../../../../../components/article/article';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './programme-tutorial.styles';

export const ProgrammeTutorial = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const navigate = (route: string) => {
    history.push(route);
  };

  const [presentArticle, setPresentArticle] = useState<boolean>(false);

  const [notifications] = useState<MenuListDataItem[]>([
    {
      title: 'Developing children holistically',
      onActionClick: () => {
        navigate('/programmes/tutorial/developing-children');
      },
    },
    {
      title: 'Learning through play',
      onActionClick: () => {
        setPresentArticle(true);
      },
    },
    {
      title: 'The daily routine',
      onActionClick: () => {
        navigate('/programmes/tutorial/daily-routine');
      },
    },
  ]);

  const startPlanning = () => {
    // ROUTE TO PROGRAMME CREATION
    history.replace('/programmes/theme');
  };

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      title={'Programme best practices'}
      color={'primary'}
      onBack={() => history.push('/classroom', { activeTabIndex: 2 })}
      className={styles.bannerContentWrapper}
      backgroundColour="uiBg"
      displayOffline={!isOnline}
    >
      <div className="bg-white">
        {notifications ? <StackedList listItems={notifications} type={'MenuList'} /> : null}
      </div>

      <div className={'px-4 pt-2 bg-uiBg'}>
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
