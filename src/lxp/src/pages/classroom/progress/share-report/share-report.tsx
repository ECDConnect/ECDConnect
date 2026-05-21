import {
  ActionModal,
  BannerWrapper,
  Button,
  Card,
  DialogPosition,
  Dropdown,
  Typography,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useRef, useState } from 'react';
import LanguageSelector from '@/components/language-selector/language-selector';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { ProgressCaregiverReportPdf } from '../caregiver-report-pdf/caregiver-report-pdf';
import { useProgressGenerateSummaryPdfReport as usePdfFromHtml } from '@/hooks/useProgressGenerateSummaryPdfReport';
import { useProgressForChild } from '@/hooks/useProgressForChild';
import ROUTES from '@/routes/routes';
import { TabsItems } from '../../class-dashboard/class-dashboard.types';
import { ContentTypeEnum, LanguageDto, useDialog } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import {
  progressTrackingActions,
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

export type ProgressShareReportState = {
  childId: string;
  reportId?: string;
  showCelebration?: boolean;
};

export const ProgressShareReport: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<Blob>();
  const [isReportReady, setIsReportReady] = useState(false);
  const { isOnline } = useOnlineStatus();
  const { state: routeState } = useLocation<ProgressShareReportState>();
  const { child, detailedReports, currentAgeGroup } = useProgressForChild(
    routeState.childId
  );
  const { generateReportAndReturnBlob, sharePdfReport } = usePdfFromHtml();
  const [selectedReport, setSelectedReport] = useState<string | undefined>(
    routeState.reportId
  );
  const shareRef = useRef<HTMLDivElement>(null);

  const changeLanguage = async (language: LanguageDto) => {
    const hasTranslations = await appDispatch(
      progressTrackingThunkActions.hasContentTypeBeenTranslated({
        id: ContentTypeEnum.ProgressTrackingCategory,
        ageGroup: currentAgeGroup?.id ?? 0,
        localeId: language.id ?? '',
      })
    ).unwrap();

    if (hasTranslations) {
      await appDispatch(
        progressTrackingThunkActions.getProgressTrackingContent({
          locale: language.locale,
        })
      ).unwrap();
      appDispatch(
        progressTrackingActions.setLocale({ localeId: language.locale })
      );
    } else {
      presentUnavailableAlert();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const presentUnavailableAlert = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (submit, close) => {
        return (
          <ActionModal
            className={'bg-white'}
            title="No content found"
            paragraphs={[
              'Could not find any content for the selected language, please select another.',
            ]}
            icon={'InformationCircleIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'infoBb'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'quatenary',
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

  const currentReportLocale = useSelector(
    progressTrackingSelectors?.getCurrentLocaleForReport
  );

  const shareReport = async () => {
    if (!isOnline) {
      showOnlineOnly();
      return;
    }

    if (!shareRef.current) return;

    setIsLoading(true);

    try {
      const pdfBlob = await generateReportAndReturnBlob(
        shareRef.current,
        shareRef.current.offsetWidth || 750
      );

      if (pdfBlob) {
        await sharePdfReport(
          pdfBlob,
          ` - ${child?.user?.fullName || child?.user?.firstName}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generatePdfReport = async () => {
    if (shareRef.current) {
      const pdfBlob = await generateReportAndReturnBlob(
        shareRef.current,
        shareRef.current?.offsetWidth || 750
      );
      setPdfBlob(pdfBlob);
    }
  };

  const dropDownList = detailedReports
    .filter((x) => !!x.dateCompleted)
    .map((x) => ({
      label: `Report ${x.reportingPeriodNumber} - ${new Date(
        x.reportingPeriodEndDate
      ).getFullYear()}`,
      value: x.id,
    }));

  return (
    <BannerWrapper
      size={'small'}
      title={'Share caregiver report'}
      onBack={() =>
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.PROGRESS,
        })
      }
      renderBorder={true}
      displayOffline={!isOnline}
    >
      <div className="mt-2 flex flex-col p-4">
        <Typography
          color="textDark"
          text={'Share a report'}
          type={'h2'}
          className="mb-4"
        />
        <Card className="bg-successMain mb-4 flex items-center gap-4 rounded-2xl p-4">
          <EmojiYellowSmile className="h-16 w-12" />
          <div className="flex flex-col">
            <Typography
              type="h3"
              weight="bold"
              color="white"
              text={`Great, you've created ${child?.user?.firstName}'s report!`}
            />
            <Typography
              type="h3"
              weight="bold"
              color="white"
              text={
                'You can share the report with caregivers or send it to yourself.'
              }
            />
          </div>
        </Card>
        <Dropdown<string>
          fillType="clear"
          label={'Which report would you like to share?'}
          textColor="textMid"
          placeholder={'Tap to choose report'}
          labelColor="textDark"
          list={dropDownList}
          selectedValue={selectedReport}
          onChange={async (item) => {
            setSelectedReport(item);
            await new Promise((resolve) => setTimeout(resolve, 0)); // wait a tick for state update
            await generatePdfReport();
          }}
          className="my-2"
        />
        <Typography
          color="textDark"
          text={'Choose report language'}
          type={'h4'}
        />
        <LanguageSelector
          showLabel={false}
          currentLocale={currentReportLocale}
          selectLanguage={(data) => {
            changeLanguage(data);
          }}
        />
        <Typography
          color="textDark"
          text={'Tips for sharing the report'}
          type={'body'}
          className="mt-4"
        />
        <div className="ml-2">
          <ul className={'text-textMid ml-4 mt-2 list-disc'}>
            <li key={'tip_1'}>
              <Typography
                className="mt-2"
                type={'body'}
                text={`Send a voice note with a short summary of what makes ${child?.user?.firstName} special, how ${child?.user?.firstName} is growing, and the activities that ${child?.user?.firstName} enjoys.`}
                color={'textMid'}
              />
            </li>
            <li key={'tip_2'}>
              <Typography
                className="mt-2"
                type={'body'}
                text={`Have a meeting with caregivers to explain the report and share what they can do to help ${child?.user?.firstName} grow.`}
                color={'textMid'}
              />
            </li>
          </ul>
        </div>
        <Button
          onClick={async () => {
            if (!isOnline) {
              showOnlineOnly();
              return;
            }
            setIsLoading(true);

            if (!isReportReady || !pdfBlob) {
              await generatePdfReport();
            }

            await shareReport();
          }}
          className="mt-4 w-full"
          size="small"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={'ShareIcon'}
          text={isLoading ? 'Loading report...' : 'Share report'}
          disabled={!selectedReport || !isReportReady || !dropDownList.length}
          isLoading={isLoading}
        />
      </div>
      {!!selectedReport && (
        <div hidden={true}>
          <div ref={shareRef} style={{ letterSpacing: '0.02px' }}>
            <ProgressCaregiverReportPdf
              childId={routeState.childId}
              reportId={selectedReport}
              onRendered={() => setIsReportReady(true)}
            />
          </div>
        </div>
      )}
    </BannerWrapper>
  );
};
