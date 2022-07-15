import {
  BannerWrapper,
  Button,
  Divider,
  Dropdown,
  DropDownOption,
  Typography,
} from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
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
import { ChildProgressReportSummaryModel } from '@ecdlink/graphql';
import { getReportingPeriod } from '@utils/child/child-profile-utils';

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
  const currentChildUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );
  const currentChildLearner = useSelector(
    classroomsSelectors.getChildLearner(currentChild)
  );
  const [selectedReport, setSelectedReport] =
    useState<ChildProgressReportSummaryModel>();
  const [loading, setLoading] = useState(false);
  const [summaryDropDownItems, setSummaryDropDownItems] = useState<
    DropDownOption<string>[]
  >([]);

  useEffect(() => {
    if (reportSummaries) {
      const options = reportSummaries.map((summary) => {
        const summaryReportingPeriod = getReportingPeriod(
          new Date(summary.reportDate)
        );

        return {
          label: `${summaryReportingPeriod.monthName.substr(0, 3)} ${
            summaryReportingPeriod.year
          }`,
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

  const downloadReports = async () => {
    if (!selectedReport) return;

    setLoading(true);

    const base64Pdf = await dispatch(
      contentReportThunkActions.generateChildProgressReport({
        childId: selectedReport.childId || '',
        classgroupId: currentChildLearner?.classroomGroupId || '',
        reportDate: selectedReport.reportDate
          ? new Date(selectedReport.reportDate)
          : new Date(),
      })
    ).unwrap();

    setLoading(false);

    const summaryReportingPeriod = getReportingPeriod(
      new Date(selectedReport.reportDate || '')
    );

    saveBase64Pdf(
      base64Pdf,
      `${currentChildUser?.firstName}-${currentChildUser?.surname}-${summaryReportingPeriod.monthName}-${summaryReportingPeriod.year}`
    );
  };

  return (
    <BannerWrapper
      size={'small'}
      color={'primary'}
      title={'Download caregiver report'}
      onBack={() => {
        if (!loading) {
          history.goBack();
        }
      }}
      displayOffline={!isOnline}
    >
      <div className={'p-4 flex flex-col'}>
        <Typography
          type={'h1'}
          color={'primary'}
          text={'Download report to share'}
        />
        <Dropdown
          placeholder={'Tap to choose a report'}
          className={'mt-4 justify-between'}
          label={'Which report would you like to download?'}
          disabled={loading}
          list={summaryDropDownItems}
          onChange={onReportSelected}
          fullWidth
        />

        <Typography
          type={'body'}
          className={'mt-4'}
          text={'Tips for sharing the report'}
          weight={'bold'}
        />
        <div className={'px-5 text-textLight'}>
          <ul className={'list-disc'}>
            <li className={'mt-2'}>
              <Typography
                type={'help'}
                hasMarkup
                color={'textLight'}
                text={`Download the report to your phone, then share it with ${currentChildUser?.firstName}'s caregiver over WhatsApp or SMS`}
              />
            </li>
            <li className={'mt-2'}>
              <Typography
                type={'help'}
                hasMarkup
                color={'textLight'}
                text={`Send a voice note with a short summary of what makes ${currentChildUser?.firstName} special, how ${currentChildUser?.firstName} is growing, and the activities that ${currentChildUser?.firstName} enjoys`}
              />
            </li>
            <li className={'mt-2'}>
              <Typography
                type={'help'}
                hasMarkup
                color={'textLight'}
                text={`Have a meeting with caregivers to explain the report and help them understand ${currentChildUser?.firstName}’s progress`}
              />
            </li>
            <li className={'mt-2'}>
              <Typography
                type={'help'}
                hasMarkup
                color={'textLight'}
                text={`Let the caregiver know what they can do to help ${currentChildUser?.firstName} grow`}
              />
            </li>
          </ul>
        </div>

        <Divider className={'my-4'} />

        <Button
          id="gtm-download-child-progress-report"
          onClick={downloadReports}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          disabled={!isOnline}
          isLoading={loading}
        >
          {!loading && renderIcon('DownloadIcon', 'h-5 w-5 text-white')}
          <Typography
            type="h6"
            className="ml-2"
            text="Download a report"
            color="white"
          />
        </Button>
      </div>
    </BannerWrapper>
  );
};
