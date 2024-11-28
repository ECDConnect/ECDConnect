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
import { ContentService } from '@/services/ContentService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
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

  const { isOnline } = useOnlineStatus();

  const { state: routeState } = useLocation<ProgressShareReportState>();

  const { child, detailedReports } = useProgressForChild(routeState.childId);

  const { generateReport } = usePdfFromHtml();

  const [selectedReport, setSelectedReport] = useState<string | undefined>(
    routeState.reportId
  );

  const shareRef = useRef<HTMLDivElement>(null);

  const userAuth = useSelector(authSelectors.getAuthUser);

  const changeLanguage = async (language: LanguageDto) => {
    const hasTranslations = await new ContentService(
      userAuth?.auth_token ?? ''
    ).hasContentTypeBeenTranslated(
      ContentTypeEnum.ProgressTrackingCategory,
      language.id ?? ''
    );

    if (hasTranslations) {
      await appDispatch(
        progressTrackingThunkActions.getProgressTrackingContent({
          locale: language.locale,
        })
      ).unwrap();
      await appDispatch(
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
            className={'mx-4'}
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

  const currentReportLocale = useSelector(
    progressTrackingSelectors?.getCurrentLocaleForReport
  );

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
          label={'Which report would you like to share?'}
          textColor="textMid"
          placeholder={'Tap to choose report'}
          labelColor="textDark"
          list={detailedReports
            .filter((x) => !!x.dateCompleted)
            .map((x) => ({
              label: `Report ${x.reportingPeriodNumber} - ${new Date(
                x.reportingPeriodEndDate
              ).getFullYear()}`,
              value: x.id,
            }))}
          selectedValue={selectedReport}
          onChange={(item) => setSelectedReport(item)}
          className="my-2"
        />
        <LanguageSelector
          labelText="Choose report language"
          labelClassName="font-medium font-body text-textDark pr-2"
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
          onClick={() => {
            if (isOnline) {
              generateReport(
                shareRef.current!,
                shareRef.current?.offsetWidth || 750
              );
            } else {
              showOnlineOnly();
            }
          }}
          className="mt-4 w-full"
          size="small"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={'ShareIcon'}
          text={'Share report'}
          disabled={!selectedReport}
        />
      </div>
      {!!selectedReport && (
        <div hidden={true}>
          <div ref={shareRef} style={{ letterSpacing: '0.01px' }}>
            <ProgressCaregiverReportPdf
              childId={routeState.childId}
              reportId={selectedReport}
            />
          </div>
        </div>
      )}
    </BannerWrapper>
  );
};
