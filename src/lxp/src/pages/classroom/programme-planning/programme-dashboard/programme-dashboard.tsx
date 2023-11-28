import { ActionModal, Card, DialogPosition, Typography } from '@ecdlink/ui';
import { isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';
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
import { useAppDispatch } from '@/store';
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

      progressSummary?.classSummaries?.map((item) => {
        total = item.childCount || 0;
        item?.categories?.map((subItem) => {
          subItem?.subCategories?.map((subCategoriesItem) => {
            subCategoriesItem?.childrenPerSkill?.map((skillItem) => {
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
      const reportMonth =
        today.getMonth() >= 0 && today.getMonth() <= 6 ? 'June' : 'November';

      if (skills.length === 0) {
        dMessage.push('None of the children are working on skills.');
      } else {
        dMessage.push(
          'Base on your ' +
            reportMonth +
            ' progress reports, here are some areas that children are working on:'
        );

        skills.sort((a, b) => a.totalChildren - b.totalChildren);
        skills.map((item, index) => {
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

      // showProgressReportDialog(dMessage);

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
          setStorageItem(0, LocalStorageKeys.hasViewedDecProgressReport);
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
  }, []);

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

  const { toPDF, targetRef } = usePDF({
    filename: 'practitioner-progress-summary-report.pdf',
  });

  const downloadPdf = useCallback(() => {
    setShowReport(true);
    setTimeout(() => toPDF(), 600);
    setTimeout(() => setShowReport(false), 600);
  }, [setShowReport, toPDF]);

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

  const getPdfReport = () => {
    return (
      <>
        <div className="mt-10 h-screen overflow-y-scroll">
          <div ref={targetRef}>
            {progressSummary?.classSummaries?.map((item, index) => {
              return (
                <div className="p-8" key={index}>
                  <div className="flex justify-between gap-2">
                    <Typography
                      className={'mr-1'}
                      type={'h1'}
                      color={'textDark'}
                      text={`${progressSummary?.reportingPeriod} Progress Summary`}
                    />
                    <div>
                      <div className="flex">
                        <Typography
                          className={'mr-1'}
                          type={'small'}
                          weight="bold"
                          color={'textDark'}
                          text={`Class:`}
                        />
                        <Typography
                          className={'mr-1'}
                          type={'small'}
                          color={'textDark'}
                          text={`${item?.className} (${item?.childCount} children)`}
                        />
                      </div>
                      <div className="flex">
                        <Typography
                          className={'mr-1'}
                          type={'small'}
                          weight="bold"
                          color={'textDark'}
                          text={`Practitioner:`}
                        />
                        <Typography
                          className={'mr-1'}
                          type={'small'}
                          color={'textDark'}
                          text={`${item?.practitionerFullName}`}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-8">
                    <Typography
                      className={'mr-1'}
                      type={'h2'}
                      weight="bold"
                      color={'textDark'}
                      text={`Number of children working on each skill`}
                    />
                    {item?.categories?.map((subItem, subItemIndex) => {
                      const getBackgroundColor = (type: string) => {
                        switch (type) {
                          case '#d3276c':
                            return 'tertiaryAccent1';
                          case '#9e4d8e':
                            return 'uiLight';
                          case '#6974AF':
                            return 'uiMid';
                          default:
                            return 'secondaryAccent1';
                        }
                      };

                      return (
                        <div key={subItemIndex}>
                          <div className="flex items-center gap-4 pt-4">
                            <div
                              className={`h-12 w-12 rounded-full bg-${getBackgroundColor(
                                subItem?.color
                              )} flex items-center justify-center`}
                            >
                              <img
                                src={subItem?.imageUrl}
                                alt=""
                                className="h-8 w-8"
                              />
                            </div>
                            <Typography
                              className={'mr-1'}
                              type={'h2'}
                              weight="bold"
                              color={'textDark'}
                              text={`${subItem?.name}`}
                            />
                          </div>
                          {subItem?.subCategories?.map(
                            (subCategoriesItem, catIndex) => {
                              return (
                                <Card
                                  className={
                                    'bg-uiBg mt-4 w-full rounded-xl p-4'
                                  }
                                  key={catIndex}
                                >
                                  <div className="flex items-center gap-2 pb-4">
                                    <div className="bg-primaryAccent1 flex h-10 w-10 items-center justify-center rounded-full">
                                      <img
                                        src={subCategoriesItem?.imageUrl}
                                        alt="subcategory"
                                        className="h-6 w-6"
                                      />
                                    </div>
                                    <Typography
                                      className={'mr-1'}
                                      type={'h4'}
                                      weight="bold"
                                      color={'textDark'}
                                      text={`${subCategoriesItem?.name}`}
                                    />
                                  </div>
                                  {subCategoriesItem?.childrenPerSkill?.map(
                                    (skillItem, skillIndex) => {
                                      return (
                                        <div
                                          className="flex items-center gap-2"
                                          key={skillIndex}
                                        >
                                          <Typography
                                            className={'mr-1 pb-4'}
                                            type={'h3'}
                                            weight="bold"
                                            color={'textDark'}
                                            text={`${skillItem?.childCount}`}
                                          />
                                          <Typography
                                            className={'mr-1 pb-4'}
                                            type={'body'}
                                            color={'textMid'}
                                            text={`${skillItem?.skill}`}
                                          />
                                        </div>
                                      );
                                    }
                                  )}
                                </Card>
                              );
                            }
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <DailyRoutine
        programme={currentProgramme}
        currentDailyProgramme={currentDailyProgramme}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        isHoliday={isHoliday}
      />
      {/* PDF download for June and November */}
      {showReport && getPdfReport()}
    </>
  );
};

export default ProgrammeDashboard;
