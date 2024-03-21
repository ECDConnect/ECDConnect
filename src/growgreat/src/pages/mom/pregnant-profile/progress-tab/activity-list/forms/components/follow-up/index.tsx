import {
  Colours,
  Divider,
  ProgressBar,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import {
  GetMotherSummaryByPrioritySelector,
  getPreviousVisitInformationForMotherSelector,
} from '@/store/visit/visit.selectors';
import {
  MotherDto,
  captureAndDownloadComponent,
  getStringFromClassNameOrId,
  getWeeksDiff,
  toCamelCase,
} from '@ecdlink/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactComponent as Home } from '@/assets/home.svg';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyInformational } from '@/assets/pollyInformational.svg';
import { ReactComponent as PollyShock } from '@/assets/pollyShock.svg';
import BabyHealthcare from '@/assets/iconCircleAntenatalSmall3.png';
import P1 from '@/assets/pillar/p1.svg';
import P5 from '@/assets/pillar/p5.svg';
import Pregnant from '@/assets/pregnant.svg';
import PrintBanner from '@/assets/printBanner.png';
import { progressSteps } from '../../../../walkthrough/steps';
import { VisitDataStatus } from '@/../../../packages/graphql/lib';
import {
  activitiesColours,
  activitiesSectionTypes,
} from '../../../activities-list';
import { InfoCard, Item } from './info-card';
import { RootState } from '@/store/types';
import {
  getMotherCurrentVisitSelector,
  getMotherNearestPreviousVisitByOrderDate,
} from '@/store/mother/mother.selectors';
import { useLocation } from 'react-router';

export interface FollowUpWalkthroughData {
  progressBar: {
    message: string;
    label: string;
    value: number;
    primaryColour: Colours;
    secondaryColour: Colours;
  };
  infoCard: {
    [key: string]: {
      comment: string;
      visitData: { visitName: string };
    }[];
  };
}

interface FollowUpComponentProps {
  mother: MotherDto;
  walkthroughData?: FollowUpWalkthroughData;
  isPrint?: boolean;
  isFromProgressTab?: boolean;
}

interface Status {
  success: VisitDataStatus[];
  warning: VisitDataStatus[];
  error: VisitDataStatus[];
  none: VisitDataStatus[];
}

type StatusType = keyof Status;

export const FollowUp = ({
  mother,
  walkthroughData,
  isPrint,
  isFromProgressTab,
}: FollowUpComponentProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const introScreenRef = useRef<HTMLDivElement>(null);
  const [showPrintData, setShowPrintData] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isPrint) {
      setShowPrintData(true);
      setTimeout(() => {
        if (introScreenRef.current) {
          captureAndDownloadComponent(
            introScreenRef.current,
            'mother-progress-summary.jpg'
          );
          setShowPrintData(false);
        }
      }, 100);
    }
  }, [isPrint]);

  // this will be available when you are busy completing a questionnaire
  const [, , , , , visitId] = location.pathname.split('/');

  // this provides the status of previous visit
  const previousVisitStatus = useSelector(
    getPreviousVisitInformationForMotherSelector
  );
  const previousVisitStatusToSort = Object.assign({}, previousVisitStatus);

  const currentVisit = useSelector((state: RootState) =>
    getMotherCurrentVisitSelector(state, visitId)
  );

  const previousVisit = useSelector((state: RootState) =>
    getMotherNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const diffDates = !!mother?.expectedDateOfDelivery
    ? getWeeksDiff(new Date(), new Date(mother?.expectedDateOfDelivery))
    : '';

  const actualGestationWeek = !!diffDates ? 40 - diffDates : '';

  const printData = useSelector(GetMotherSummaryByPrioritySelector);

  const getColorAndIcon = useCallback(
    (
      color: string
    ): { primaryColour: Colours; secondaryColour: Colours; icon: string } => {
      const formattedColor = color.toLowerCase();
      switch (formattedColor) {
        case 'warning':
          return {
            primaryColour: 'alertMain',
            secondaryColour: 'alertBg',
            icon: 'ExclamationIcon',
          };
        case 'error':
          return {
            primaryColour: 'errorMain',
            secondaryColour: 'errorBg',
            icon: 'ExclamationCircleIcon',
          };
        case 'success':
        default:
          return {
            primaryColour: 'successMain',
            secondaryColour: 'successBg',
            icon: 'BadgeCheckIcon',
          };
      }
    },
    []
  );

  const progressBarOptions = useMemo((): {
    primaryColour: Colours;
    secondaryColour: Colours;
    value: number;
    message: string;
  } => {
    switch (previousVisitStatus?.scoreColor) {
      case 'Warning':
        return {
          primaryColour: 'alertMain',
          secondaryColour: 'alertBg',
          message: `${name} needs support`,
          value: 50,
        };
      case 'Success':
        return {
          primaryColour: 'successMain',
          secondaryColour: 'successBg',
          message: `${name} are going well`,
          value: 100,
        };
      case 'Error':
      default:
        return {
          primaryColour: 'errorMain',
          secondaryColour: 'errorBg',
          message: `${name} needs urgent support`,
          value: 25,
        };
    }
  }, [name, previousVisitStatus?.scoreColor]);

  const getVisitIcon = (visitName: string) => {
    switch (visitName) {
      case activitiesSectionTypes.healthCare:
        return {
          icon: BabyHealthcare,
          color: activitiesColours.other.primaryColor,
        };
      case activitiesSectionTypes.nutrition:
        return { icon: P1, color: '#8CDBDF' };
      case activitiesSectionTypes.pregnancyCare:
        return {
          icon: Pregnant,
          color: activitiesColours.pillar1.primaryColor,
        };
      default:
        return { icon: P5, color: activitiesColours.pillar5.primaryColor };
    }
  };

  const groupedData = useMemo(() => {
    if (!!walkthroughData?.infoCard) return walkthroughData.infoCard;

    const sortedData = previousVisitStatusToSort?.visitDataStatus
      ?.slice()
      .sort(function (a, b) {
        var colorOrder = ['Success', 'Warning', 'Error'];
        return (
          colorOrder.indexOf(a?.color || '') -
          colorOrder.indexOf(b?.color || '')
        );
      });
    const groupedData = sortedData?.reduce(
      (acc: { [key: string]: any }, currentValue) => {
        const color = toCamelCase(currentValue?.color || '');
        if (!color) return acc;
        if (!acc[color]) {
          acc[color] = [];
        }
        acc[color].push(currentValue);
        return acc;
      },
      {}
    );
    return groupedData;
  }, [previousVisitStatusToSort?.visitDataStatus, walkthroughData]) as
    | Status
    | undefined;

  if (
    (!previousVisitStatus?.visitDataStatus?.length && !walkthroughData) ||
    (isFromProgressTab && !previousVisit)
  ) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center gap-4">
        <Home />
        <div className="h-24">
          <Typography
            type="h3"
            align="center"
            text={`You haven't visited ${name} yet`}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex gap-4"
        id={getStringFromClassNameOrId(progressSteps[0].target)}
      >
        <Typography
          className="w-2/4"
          type="h4"
          text={
            walkthroughData?.progressBar.message || progressBarOptions.message
          }
        />
        <div className="h-16 w-2/4">
          <ProgressBar
            label={
              walkthroughData?.progressBar.label ||
              previousVisitStatus?.score ||
              ''
            }
            subLabel="score"
            value={
              walkthroughData?.progressBar.value || progressBarOptions.value
            }
            primaryColour={
              walkthroughData?.progressBar.primaryColour ||
              progressBarOptions.primaryColour
            }
            secondaryColour={
              walkthroughData?.progressBar.secondaryColour ||
              progressBarOptions.secondaryColour
            }
          />
        </div>
      </div>

      <Divider dividerType="dashed" className="my-8" />
      <Typography
        className="mb-8"
        type="h4"
        text={`Here is a summary of how ${name} is doing:`}
      />

      <Divider dividerType="dashed" className="mt-4 mb-8" />
      <div id={getStringFromClassNameOrId(progressSteps[1].target)}>
        {!!groupedData &&
          Object.keys(groupedData).map((item, index) => {
            const { icon, primaryColour, secondaryColour } =
              getColorAndIcon(item);

            const dataByStatus = groupedData[item as StatusType];
            const uniqueData = dataByStatus.filter((object, index, array) => {
              return (
                index ===
                array.findIndex(
                  (newObject) => newObject.comment === object.comment
                )
              );
            });

            return (
              <InfoCard
                key={index}
                className="my-6"
                icon={icon}
                items={uniqueData.map((data): Item => {
                  const { icon, color } = getVisitIcon(data?.section || '');
                  return {
                    customIcon: icon,
                    iconHexBackgroundColour: color,
                    title: `${data.comment}`,
                  };
                })}
                primaryColour={primaryColour}
                secondaryColour={secondaryColour}
              />
            );
          })}
      </div>

      {/* Client print data display */}
      <div
        ref={introScreenRef}
        style={{ display: showPrintData ? 'block' : 'none' }}
      >
        <img src={PrintBanner} alt="" />
        <div
          className="mb-2 flex flex-col justify-center p-4"
          style={{ backgroundColor: '#FEF1E8' }}
        >
          <Typography
            type="h2"
            align="center"
            weight="bold"
            text={`${name}'s Progress`}
            color="textDark"
          />
          <Typography
            type="body"
            align="center"
            weight="skinny"
            text={`${actualGestationWeek} weeks pregnant`}
            color="textMid"
          />
        </div>
        {!!printData &&
          Object.values(printData).map((visit, index) => {
            const summaryItems = visit?.summaryData?.map((item) => {
              return item?.comment?.toString();
            });

            const documentItems = visit?.documentData?.map((item) => {
              return item?.comment?.toString();
            });

            return (
              <div key={index}>
                {visit?.areaName !== 'ID document' &&
                  visit?.color?.toLowerCase() === 'success' &&
                  summaryItems?.length !== 0 && (
                    <>
                      <div className="rounded-10 text-successDark false bg-successBg border-successMain mb-4 border-2 p-4">
                        <div className="flex flex-row ">
                          <div>
                            <PollyHappy className="h-10 w-10" />
                          </div>
                          <div className="flex flex-col items-start justify-start ">
                            <div className="ml-3 ">
                              <p className=" font-h1 text-successDark text-sm font-semibold ">
                                {visit?.areaName}
                              </p>
                              <div className="pt-2">
                                {summaryItems?.map((item, indexb) => (
                                  <div className="flex gap-2" key={indexb}>
                                    <div className="bg-undefined flex flex-shrink-0 items-center justify-center rounded-full text-white">
                                      {renderIcon(
                                        'BadgeCheckIcon',
                                        `w-5 h-5 text-successDark`
                                      )}
                                    </div>
                                    <Typography
                                      type="markdown"
                                      className="text-textDark w-full"
                                      text={item}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-1"></div>
                    </>
                  )}
                {visit?.areaName !== 'ID document' &&
                  visit?.color?.toLowerCase() === 'warning' &&
                  summaryItems?.length !== 0 && (
                    <>
                      <div className="rounded-10 text-alertDark false bg-alertBg border-alertMain mb-4 border-2 p-4">
                        <div className="flex flex-row ">
                          <div>
                            <PollyInformational className="h-10 w-10" />
                          </div>
                          <div className="flex flex-col items-start justify-start ">
                            <div className="ml-3 ">
                              <p className=" font-h1 text-alertDark text-sm font-semibold ">
                                {visit?.areaName}
                              </p>
                              <div className="pt-2">
                                {summaryItems?.map((item, indexb) => (
                                  <div className="flex gap-2" key={indexb}>
                                    <div className="bg-undefined flex flex-shrink-0 items-center justify-center rounded-full text-white">
                                      {renderIcon(
                                        'ExclamationIcon',
                                        `w-5 h-5 text-alertDark`
                                      )}
                                    </div>
                                    <Typography
                                      type="markdown"
                                      className="text-textDark w-full"
                                      text={item}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-1"></div>
                    </>
                  )}
                {visit?.areaName !== 'ID document' &&
                  visit?.color?.toLowerCase() === 'error' &&
                  summaryItems?.length !== 0 && (
                    <>
                      <div className="rounded-10 text-errorDark false bg-errorBg border-errorMain mb-4 border-2 p-4">
                        <div className="flex flex-row ">
                          <div>
                            <PollyShock className="h-10 w-10" />
                          </div>
                          <div className="flex flex-col items-start justify-start ">
                            <div className="ml-3 ">
                              <p className=" font-h1 text-errorDark text-sm font-semibold ">
                                {visit?.areaName}
                              </p>
                              <div className="pt-2">
                                {summaryItems?.map((item, indexb) => (
                                  <div className="flex gap-2" key={indexb}>
                                    <div className="bg-undefined flex flex-shrink-0 items-center justify-center rounded-full text-white">
                                      {renderIcon(
                                        'ExclamationIcon',
                                        `w-5 h-5 text-errorDark`
                                      )}
                                    </div>
                                    <Typography
                                      type="markdown"
                                      className="text-textDark w-full"
                                      text={item}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-1"></div>
                    </>
                  )}

                {visit?.areaName === 'ID document' &&
                  visit?.color?.toLowerCase() === 'success' &&
                  documentItems?.length !== 0 && (
                    <>
                      <div className="rounded-10 text-successDark false bg-successBg border-successMain mb-4 border-2 p-4">
                        <div className="flex flex-row ">
                          <div className="rounded-full">
                            {renderIcon(
                              'BadgeCheckIcon',
                              'text-successMain w-10 h-10'
                            )}
                          </div>
                          <div className="flex flex-col items-start justify-start ">
                            <div className="ml-3 ">
                              <p className=" font-h1 text-successDark text-sm font-semibold "></p>
                              <div className="pt-2">
                                {documentItems?.map((item, indexb) => (
                                  <div className="flex gap-2" key={indexb}>
                                    <Typography
                                      type="markdown"
                                      className="text-textDark w-full"
                                      text={item}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-1"></div>
                    </>
                  )}
                {visit?.areaName === 'ID document' &&
                  visit?.color?.toLowerCase() === 'warning' &&
                  documentItems?.length !== 0 && (
                    <>
                      <div className="rounded-10 text-alertDark false bg-alertBg border-warningMain mb-4 border-2 p-4">
                        <div className="flex flex-row ">
                          <div className="rounded-full">
                            {renderIcon(
                              'ExclamationIcon',
                              'text-alertMain w-10 h-10'
                            )}
                          </div>
                          <div className="flex flex-col items-start justify-start ">
                            <div className="ml-3 ">
                              <p className=" font-h1 text-alertDark text-sm font-semibold "></p>
                              <div className="pt-2">
                                {documentItems?.map((item, indexb) => (
                                  <div className="flex gap-2" key={indexb}>
                                    <Typography
                                      type="markdown"
                                      className="text-textDark w-full"
                                      text={item}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            );
          })}
      </div>
    </>
  );
};
