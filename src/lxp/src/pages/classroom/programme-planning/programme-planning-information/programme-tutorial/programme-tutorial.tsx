import { ContentConsentTypeEnum } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  ComponentBaseProps,
  StackedList,
  StackedListItemType,
  Typography,
  MenuListDataItem,
  Alert,
  renderIcon,
  classNames,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Article from '../../../../../components/article/article';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './programme-tutorial.styles';
import ROUTES from '@routes/routes';
import ProgressReport from '../../components/progress-report/progress-report';
import { useSelector } from 'react-redux';
import {
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useAppDispatch } from '@/store';
const { usePDF } = require('react-to-pdf');

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
  const appDispatch = useAppDispatch();

  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [showReport, setShowReport] = useState(false);
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

  const progressSummary = useSelector(
    progressTrackingSelectors?.getPractitionerProgressReportSummary
  );
  const fetchData = useCallback(
    async (reportDate: string) => {
      await appDispatch(
        progressTrackingThunkActions.getPractitionerProgressReportSummary({
          reportingPeriod: reportDate,
        })
      );
    },
    [appDispatch]
  );

  useEffect(() => {
    if (!progressSummary) {
      const today = new Date();
      const reportDate =
        today.getMonth() >= 0 && today.getMonth() <= 6
          ? 'June'
          : 'November' + today.getFullYear();
      fetchData(reportDate);
    }
  }, []);

  const { toPDF, targetRef } = usePDF({
    filename: 'practitioner-progress-summary-report.pdf',
  });

  const downloadPdf = useCallback(() => {
    setShowReport(true);
    setTimeout(() => toPDF(), 600);
    setTimeout(() => setShowReport(false), 600);
  }, [setShowReport, toPDF]);

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

      <Alert
        className=""
        message={`You can use the results from your progress reports to help children learn!`}
        type="info"
        button={
          <Button
            onClick={() => downloadPdf()}
            className="w-full"
            size="small"
            color="primary"
            type="filled"
          >
            {renderIcon('ChartBarIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="small"
              className="ml-2"
              text="Get class programme summary"
              color="white"
            />
          </Button>
        }
      />

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

      {showReport && (
        <div className="mt-10 h-screen overflow-y-scroll">
          <div ref={targetRef}>
            <ProgressReport progressSummary={progressSummary!} />
          </div>
        </div>
      )}
    </BannerWrapper>
  );
};

export default ProgrammeTutorial;
