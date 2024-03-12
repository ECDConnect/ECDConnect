import {
  BannerWrapper,
  Button,
  ComponentBaseProps,
  StackedList,
  StackedListItemType,
  Typography,
  DialogPosition,
  Dialog,
  MenuListDataItem,
  Alert,
  renderIcon,
  classNames,
  MoreInformationPage,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import * as styles from './programme-tutorial.styles';
import ROUTES from '@routes/routes';
import ProgressReport from '../../components/progress-report/progress-report';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import {
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useAppDispatch } from '@/store';
import { MoreInformation } from '@ecdlink/graphql';
import InfoService from '@/services/InfoService/InfoService';
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
  const [data, setData] = useState<MoreInformation[]>();
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');
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
  }, [progressSummary, fetchData]);

  useEffect(() => {
    setIsLoading(true);
    new InfoService()
      .getMoreInformation('Programme', selectedLanguage)
      .then((info) => {
        setData(info);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedLanguage]);

  const { toPDF, targetRef } = usePDF({
    filename: 'practitioner-progress-summary-report.pdf',
  });

  const downloadPdf = useCallback(() => {
    setShowReport(true);
    setTimeout(() => toPDF(), 600);
    setTimeout(() => setShowReport(false), 600);
  }, [setShowReport, toPDF]);

  if (presentArticle) {
    return (
      <Dialog
        fullScreen={true}
        visible={presentArticle}
        position={DialogPosition.Full}
      >
        <MoreInformationPage
          isLoading={isLoading}
          languages={languages.map((x) => ({
            value: x.locale,
            label: x.description,
          }))}
          moreInformation={!!data ? data[0] : {}}
          title={'Learning through play'}
          onClose={() => history.goBack()}
          setSelectedLanguage={setSelectedLanguage}
        />
      </Dialog>
    );
  }

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
