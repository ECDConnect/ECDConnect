import { ActionModal, DialogPosition } from '@ecdlink/ui';
import { isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';
import { programmeSelectors } from '@store/programme';
import { DailyRoutine } from './components/daily-routine/daily-routine';
import { useCallback, useEffect, useState } from 'react';
import { useHolidays } from '@/hooks/useHolidays';
import { LocalStorageKeys, useDialog } from '@ecdlink/core';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import iconRobotImage from '@/assets/iconRobot.svg';
import {
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useHistory } from 'react-router';
import { useAppDispatch } from '@/store';
import ProgressReport from '../components/progress-report/progress-report';
import walktroughImage from '../../../../assets/walktroughImage.png';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  programmeThemeSelectors,
  programmeThemeThunkActions,
} from '@/store/content/programme-theme';
import ROUTES from '@routes/routes';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

const { usePDF } = require('react-to-pdf');

interface ProgrammeDashboardProps {
  programmeStartDate: Date | undefined;
}

export interface iSkills {
  skill: string;
  totalChildren: number;
}

export const ProgrammeDashboard: React.FC<ProgrammeDashboardProps> = ({
  programmeStartDate,
}) => {
  const [showFirstVisitModal, setShowFirstVisitModal] = useState(true);
  const history = useHistory();
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const user = useSelector(userSelectors.getUser);
  const dialog = useDialog();
  const appDispatch = useAppDispatch();
  const [showReport, setShowReport] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    programmeStartDate || new Date()
  );
  const currentProgramme = useSelector(
    programmeSelectors.getProgrammeByDate(new Date(selectedDate))
  );
  const currentDailyProgramme = currentProgramme?.dailyProgrammes.find(
    (dailyRoutine) => isSameDay(new Date(dailyRoutine?.dayDate), selectedDate)
  );
  const holiday = useHolidays();
  const isHoliday = holiday?.isHoliday(selectedDate);

  // Progress Summary Report
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

  const { toPDF, targetRef } = usePDF({
    filename: 'practitioner-progress-summary-report.pdf',
  });

  const downloadPdf = useCallback(() => {
    setShowReport(true);
    setTimeout(() => toPDF(), 600);
    setTimeout(() => setShowReport(false), 600);
  }, [setShowReport, toPDF]);

  const storageFirstVisit = getStorageItem<number>(
    LocalStorageKeys.hasVisitedProgrammeDashboard || false
  );

  const showFirstVisit = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          customIcon={
            <div className="flex">
              <img src={walktroughImage} alt="profile" className="mb-2" />
            </div>
          }
          importantText={`Hello, ${user?.firstName}! Start planning your daily routine`}
          detailText={
            'Choose a theme and create your own programme for this week'
          }
          actionButtons={[
            {
              text: 'Choose a theme',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                setStorageItem(
                  true,
                  LocalStorageKeys.hasVisitedProgrammeDashboard
                );
                history.push(ROUTES.PROGRAMMES.THEME);
                onCancel();
              },
              leadingIcon: 'BookOpenIcon',
            },
            {
              text: 'Create my own programme',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                setStorageItem(
                  true,
                  LocalStorageKeys.hasVisitedProgrammeDashboard
                );
                onCancel();
              },
              leadingIcon: 'PencilIcon',
            },
          ]}
        />
      ),
    });
  };

  useEffect(() => {
    if (storageFirstVisit) {
      showFirstVisit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFirstVisitModal]);

  useEffect(() => {
    if (!progressSummary) {
      const today = new Date();
      const reportDate =
        today.getMonth() >= 0 && today.getMonth() <= 6
          ? 'June'
          : 'November' + today.getFullYear();
      fetchData(reportDate);
    } else {
      let total: number = 0;
      const skills: iSkills[] = [];
      const dMessage = [];

      const showProgressReportDialog = async (dMessage: string[]) => {
        dialog({
          // blocking: true,
          position: DialogPosition.Middle,
          render: (onSubmit: any, onCancel: any) => (
            <ActionModal
              className={'mx-4'}
              title="What are children working on?"
              paragraphs={dMessage}
              customIcon={
                <div
                  className="bg-tertiary mb-4 flex h-auto justify-center overflow-hidden rounded-full"
                  style={{ width: 85 }}
                >
                  <img src={iconRobotImage} alt="card" />
                </div>
              }
              actionButtons={[
                {
                  text: 'Download the full summary',
                  colour: 'primary',
                  onClick: () => {
                    downloadPdf();
                    setTimeout(() => onCancel(), 600);
                  },
                  type: 'filled',
                  textColour: 'white',
                  leadingIcon: 'DownloadIcon',
                },
                {
                  text: 'Close',
                  textColour: 'primary',
                  colour: 'primary',
                  type: 'outlined',
                  onClick: () => onCancel(),
                  leadingIcon: 'XIcon',
                },
              ]}
            />
          ),
        });
      };

      progressSummary?.classSummaries?.forEach((item) => {
        total = item.childCount || 0;
        item?.categories?.forEach((subItem) => {
          subItem?.subCategories?.forEach((subCategoriesItem) => {
            subCategoriesItem?.childrenPerSkill?.forEach((skillItem) => {
              let childSkill: string = skillItem?.skill || '';
              let childCount: number = skillItem?.childCount || 0;
              const existing = skills.find((n) => n.skill === childSkill);
              if (existing) {
                childCount = existing.totalChildren + childCount;
              }
              skills.push({ skill: childSkill, totalChildren: childCount });
            });
          });
        });
      });

      const today = new Date();
      const thisYear31July = new Date(today.getFullYear(), 6, 31);
      const thisYear20Dec = new Date(today.getFullYear(), 11, 20);
      const nextYear31July = new Date(today.getFullYear() + 1, 6, 31);
      const reportMonth = today.getMonth() >= 6 ? 'June' : 'November';

      if (skills.length === 0) {
        dMessage.push('None of the children are working on skills.');
      } else {
        dMessage.push(
          'Based on your ' +
            reportMonth +
            ' progress reports, here are some areas that children are working on:'
        );

        skills.sort((a, b) => a.totalChildren - b.totalChildren);
        skills.forEach((item, index) => {
          if (index <= 2) {
            dMessage.push(
              '- ' +
                item.skill +
                ' (' +
                item.totalChildren +
                (item.totalChildren === 1 ? ' child)' : ' children)')
            );
          }
        });

        dMessage.push(
          'Think about adding activities to work on these areas. Download the full summary.'
        );
      }

      const storageItemJuly = getStorageItem<number>(
        LocalStorageKeys.hasViewedJulProgressReport
      );
      const storageItemDecember = getStorageItem<number>(
        LocalStorageKeys.hasViewedDecProgressReport
      );

      if (total > 0) {
        if (today >= thisYear31July && today < thisYear20Dec) {
          if (!storageItemJuly || storageItemJuly === 0) {
            setStorageItem(
              today.getTime(),
              LocalStorageKeys.hasViewedJulProgressReport
            );
            showProgressReportDialog(dMessage);
          }
        } else if (today >= thisYear20Dec && today < nextYear31July) {
          if (!storageItemDecember || storageItemDecember === 0) {
            showProgressReportDialog(dMessage);
            setStorageItem(
              today.getTime(),
              LocalStorageKeys.hasViewedDecProgressReport
            );
          }
        }
      }
    }
  }, [fetchData, progressSummary, downloadPdf, dialog]);

  // const handleAddProgramme = () => {
  //   if (isOnline) {
  //     history.push(ROUTES.PROGRAMMES.THEME);
  //   } else {
  //     showOnlineOnly();
  //   }
  // };

  // const showOnlineOnly = () => {
  //   dialog({
  //     position: DialogPosition.Bottom,
  //     render: (onSubmit) => {
  //       return <div>test</div>//<OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
  //     },
  //   });
  // };

  return (
    <>
      <DailyRoutine
        programme={currentProgramme}
        currentDailyProgramme={currentDailyProgramme}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        isHoliday={isHoliday}
      />

      {showReport && (
        <div className="mt-10 h-screen overflow-y-scroll">
          <div ref={targetRef}>
            <ProgressReport progressSummary={progressSummary!} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProgrammeDashboard;
