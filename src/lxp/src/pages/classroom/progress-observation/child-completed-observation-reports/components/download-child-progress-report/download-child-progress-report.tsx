import { useDialog } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  Dropdown,
  DropDownOption,
  Typography,
  renderIcon,
  DialogPosition,
  ActionModal,
} from '@ecdlink/ui';
import { childrenSelectors } from '@store/children';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { DownloadChildProgressReportState } from './download-child-progress-report.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@store';
import {
  contentReportSelectors,
  contentReportThunkActions,
} from '@store/content/report';
import { classroomsSelectors } from '@store/classroom';
import { saveBase64Pdf } from '@utils/child/child-progress-report.utils';
import { getReportingPeriod } from '@utils/child/child-profile-utils';
import ROUTES from '@/routes/routes';

export const DownloadChildProgressReport: React.FC = () => {
  const history = useHistory();
  const { state: routeState } = useLocation<DownloadChildProgressReportState>();
  const dispatch = useAppDispatch();
  const reportSummaries = useSelector(
    contentReportSelectors.getChildProgressReportSummaries(routeState.childId)
  );
  const currentChild = useSelector(
    childrenSelectors.getChildById(routeState.childId)
  );
  const currentChildClassroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(currentChild?.userId!)
  );
  const [selectedReport, setSelectedReport] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [summaryDropDownItems, setSummaryDropDownItems] = useState<
    DropDownOption<string>[]
  >([]);
  const dialog = useDialog();
  const [downloaded, setDownloaded] = useState<boolean>(false);

  useEffect(() => {
    if (reportSummaries) {
      const options = reportSummaries
        .filter((summary) => summary.reportPeriod !== 'First')
        .map((summary) => {
          const summaryReportingPeriod = getReportingPeriod(
            new Date(summary.reportDate)
          );

          return {
            label: `${summaryReportingPeriod.monthName} ${summaryReportingPeriod.year}`,
            value: summary.reportId,
          };
        });

      setSummaryDropDownItems(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onReportSelected = (reportId: string) => {
    const lookedUpReport = reportSummaries.find(
      (report) => report.reportId === reportId
    );
    setSelectedReport(lookedUpReport);
  };

  const { isOnline } = useOnlineStatus();

  const fetchReportFailed = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, close) => {
        return (
          <ActionModal
            className={'mx-4'}
            title="Report could not generated"
            paragraphs={['Unable to generate report, please try again later.']}
            icon={'ExclamationIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'infoBb'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'primary',
                onClick: close,
                type: 'filled',
                textColour: 'white',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const shareReport = async () => {
    if (!selectedReport) return;

    setLoading(true);

    const base64Pdf = await dispatch(
      contentReportThunkActions.generateChildProgressReport({
        childId: selectedReport.childId || '',
        classgroupId: currentChildClassroomGroup?.id || '',
        reportDate: selectedReport.reportDate
          ? new Date(selectedReport.reportDate)
          : new Date(),
      })
    ).unwrap();

    setLoading(false);

    if (!!base64Pdf) {
      const summaryReportingPeriod = getReportingPeriod(
        new Date(selectedReport.reportDate || '')
      );

      saveBase64Pdf(
        base64Pdf,
        `${currentChild?.user?.firstName}-${currentChild?.user?.surname}-${summaryReportingPeriod.monthName}-${summaryReportingPeriod.year}`
      );

      setDownloaded(true);
    } else {
      fetchReportFailed();
    }
  };

  return (
    <BannerWrapper
      size={'small'}
      color={'primary'}
      title={'Share caregiver report'}
      onBack={() => {
        if (!loading) {
          if (downloaded) {
            history.replace(ROUTES.CHILD_PROFILE, {
              childId: currentChild?.id,
            });
          } else {
            history.goBack();
          }
        }
      }}
      displayOffline={!isOnline}
    >
      <div className={'flex flex-col p-4'}>
        <Typography
          type={'h1'}
          color={'textDark'}
          text={'Share a report'}
          className="mt-2"
        />
        <Dropdown
          placeholder={'Tap to choose a report'}
          className={'mt-4 justify-between'}
          label={'Which report would you like to share?'}
          disabled={loading}
          list={summaryDropDownItems}
          onChange={onReportSelected}
          fullWidth
        />
        <Typography
          type={'h4'}
          className={'mt-4'}
          text={'Tips for sharing the report'}
          weight={'bold'}
        />
        <div className={'text-textMid px-5'}>
          <ul className={'list-disc'}>
            <li className={'mt-2'}>
              <Typography
                type={'help'}
                hasMarkup
                color={'textMid'}
                text={`Send a voice note with a short summary of what makes ${currentChild?.user?.firstName} special, how ${currentChild?.user?.firstName} is growing, and the activities that ${currentChild?.user?.firstName} enjoys`}
              />
            </li>
            <li className={'mt-2'}>
              <Typography
                type={'help'}
                hasMarkup
                color={'textMid'}
                text={`Have a meeting with caregivers to explain the report and help them understand ${currentChild?.user?.firstName}’s progress`}
              />
            </li>
            <li className={'mt-2'}>
              <Typography
                type={'help'}
                hasMarkup
                color={'textMid'}
                text={`Let the caregiver know what they can do to help ${currentChild?.user?.firstName} grow`}
              />
            </li>
          </ul>
        </div>
        <Button
          id="gtm-download-child-progress-report"
          onClick={shareReport}
          className="mt-4 w-full"
          size="small"
          color="primary"
          type="filled"
          disabled={!isOnline}
          isLoading={loading}
        >
          {!loading && renderIcon('ShareIcon', 'h-5 w-5 text-white')}
          <Typography type="h6" className="ml-2" text="Share" color="white" />
        </Button>
      </div>
    </BannerWrapper>
  );
};
