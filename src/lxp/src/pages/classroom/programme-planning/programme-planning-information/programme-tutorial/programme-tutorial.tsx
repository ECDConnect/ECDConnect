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
  ActionModal,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import { ProgrammeDashboardRouteParams } from '../../programme-dashboard/programme-dashboard.types';
import { useTenant } from '@/hooks/useTenant';
import { useAppContext } from '@/walkthrougContext';
import { WalkthroughModal } from '@/components/walkthrough/modal';
import { MoreInformationTypeEnum, useDialog } from '@ecdlink/core';
import { ProgrammeThemeRouteState } from '../../programme-theme/programme-theme.types';
const { usePDF } = require('react-to-pdf');

interface ProgrammeTutorialProps extends ComponentBaseProps {
  listItems: StackedListItemType[];
  notification?: Notification;
}

export const ProgrammeTutorial: React.FC<ProgrammeTutorialProps> = ({
  listItems,
  notification,
}) => {
  const { tenant } = useTenant();
  const { classroomGroupId } = useParams<ProgrammeDashboardRouteParams>();

  const dialog = useDialog();

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
  const infoPages: MenuListDataItem[] = [
    {
      title: 'Developing children holistically',
      showIcon: true,
      onActionClick: () => {
        navigate(
          ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.TUTORIAL.DEVELOPING_CHILDREN.replace(
            ':classroomGroupId',
            classroomGroupId
          )
        );
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
        navigate(
          ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.TUTORIAL.DAILY_ROUTINE.replace(
            ':classroomGroupId',
            classroomGroupId
          )
        );
      },
    },
  ];

  const startPlanning = () => {
    // ROUTE TO PROGRAMME CREATION
    history.replace(ROUTES.PROGRAMMES.THEME, {
      classroomGroupId,
    } as ProgrammeThemeRouteState);
  };

  const progressSummary = useSelector(
    progressTrackingSelectors.getPractitionerProgressReportSummary
  );

  const fetchData = useCallback(async (reportDate: string) => {
    // await appDispatch(
    //   progressTrackingThunkActions.getPractitionerProgressReportSummary({
    //     reportingPeriod: reportDate,
    //   })
    // );
  }, []);

  useEffect(() => {
    if (!progressSummary) {
      const today = new Date();
      const reportDate =
        today.getMonth() < 6
          ? `June${today.getFullYear()}`
          : `November${today.getFullYear()}`;
      fetchData(reportDate);
    }
  }, [progressSummary, fetchData]);

  useEffect(() => {
    setIsLoading(true);
    new InfoService()
      .getMoreInformation(
        MoreInformationTypeEnum.LearningThroughPlay,
        selectedLanguage
      )
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

  const { setState } = useAppContext();

  const handleWalkthroughLanguage = useCallback(() => {
    return dialog({
      blocking: true,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => (
        <WalkthroughModal
          onStart={() => {
            setState({ run: true, tourActive: true, stepIndex: 0 });
            history.push(
              ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
                ':classroomGroupId',
                classroomGroupId
              )
            );
            onClose();
          }}
        />
      ),
    });
  }, [classroomGroupId, dialog, history, setState]);

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
          onClose={() => setPresentArticle(false)}
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
      onBack={() =>
        history.push(
          ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
            ':classroomGroupId',
            classroomGroupId
          )
        )
      }
      className={`${styles.bannerContentWrapper}`}
      backgroundColour="uiBg"
      displayOffline={!isOnline}
    >
      <ActionModal
        title={`How can I plan my activities on ${tenant?.applicationName}?`}
        className="bg-uiBg rounded-15 mt-6 shadow-md"
        actionButtons={[
          {
            type: 'filled',
            colour: 'quatenary',
            text: 'Start walkthrough',
            textColour: 'white',
            leadingIcon: 'ArrowCircleRightIcon',
            onClick: handleWalkthroughLanguage,
          },
        ]}
      />
      <StackedList
        type={'MenuList'}
        className={styles.stackedList}
        listItems={infoPages}
      />
      <Alert
        className=""
        message={`You can use the results from your progress reports to help children learn!`}
        type="info"
        button={
          <Button
            onClick={() => downloadPdf()}
            className="w-full"
            size="small"
            color="quatenary"
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
      <Button
        color={'quatenary'}
        type={'filled'}
        onClick={startPlanning}
        className={styles.closeButton}
        text="Start planning my programme"
        textColor="white"
        icon="ArrowCircleRightIcon"
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
