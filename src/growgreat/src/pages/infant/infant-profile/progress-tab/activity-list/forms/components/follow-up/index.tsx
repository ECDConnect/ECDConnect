import {
  Colours,
  Divider,
  ProgressBar,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import {
  GetInfantSummaryByPrioritySelector,
  getPreviousVisitInformationForInfantSelector,
} from '@/store/visit/visit.selectors';
import {
  InfantDto,
  captureAndDownloadComponent,
  getStringFromClassNameOrId,
  toCamelCase,
} from '@ecdlink/core';
import { VisitDataStatus } from '@ecdlink/graphql';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import P1 from '@/assets/pillar/p1.svg';
import P2 from '@/assets/pillar/p2.svg';
import P3 from '@/assets/pillar/p3.svg';
import P4 from '@/assets/pillar/p4.svg';
import P5 from '@/assets/pillar/p5.svg';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollyInformational } from '@/assets/pollyInformational.svg';
import { ReactComponent as PollyShock } from '@/assets/pollyShock.svg';
import PrintBanner from '@/assets/printBanner.png';
import { ReactComponent as Home } from '@/assets/home.svg';

import { activitiesColours, activitiesTypes } from '../../../activities-list';
// import { InfoCard, Item } from './info-card';
import { Card, CardProps } from './card';
import { GrowthCard } from './growth-card';
import { useParams } from 'react-router';
import { InfantProfileParams } from '@/pages/infant/infant-profile/infant-profile.types';
import { RootState } from '@/store/types';
import {
  getInfantCurrentVisitSelector,
  getInfantNearestPreviousVisitByOrderDate,
} from '@/store/infant/infant.selectors';
import { progressSteps } from '../../../../walkthrough/steps';
import { InfoCard, Item } from './info-card';
import { getAge } from '../../care-for-baby-steps/care-for-baby';

export interface FollowUpWalkthroughData {
  progressBar: {
    message: string;
    label: string;
    value: number;
    primaryColour: Colours;
    secondaryColour: Colours;
  };
  growCard: {
    comment: string;
    color: string;
  };
  weightCard: {
    value: string;
    color: string;
    comment: string;
  };
  infoCard: {
    [key: string]: {
      comment: string;
      visitData: { visitName: string };
    }[];
  };
}

interface FollowUpComponentProps {
  infant: InfantDto;
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
  infant,
  walkthroughData,
  isPrint,
  isFromProgressTab,
}: FollowUpComponentProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const { visitId } = useParams<InfantProfileParams>();
  const introScreenRef = useRef<HTMLDivElement>(null);
  const [showPrintData, setShowPrintData] = useState(false);

  const currentVisit = useSelector((state: RootState) =>
    getInfantCurrentVisitSelector(state, visitId)
  );

  const previousVisit = useSelector((state: RootState) =>
    getInfantNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  const followUpDate =
    !currentVisit?.attended && !currentVisit?.visitInProgress
      ? previousVisit?.actualVisitDate
      : currentVisit.actualVisitDate;

  useEffect(() => {
    if (isPrint) {
      setShowPrintData(true);
      setTimeout(() => {
        if (introScreenRef.current) {
          captureAndDownloadComponent(
            introScreenRef.current,
            'child-progress-summary.jpg'
          );
          setShowPrintData(false);
        }
      }, 100);
    }
  }, [isPrint]);

  const printData = useSelector(GetInfantSummaryByPrioritySelector);

  const previousVisitStatus = useSelector(
    getPreviousVisitInformationForInfantSelector
  );
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

  const { weight, length, muac, grow } = useMemo(() => {
    const weight = {
      name: 'Weight',
      value: walkthroughData?.weightCard.value || previousVisitStatus?.weight,
      color:
        walkthroughData?.weightCard.color || previousVisitStatus?.weightColor,
      comment:
        walkthroughData?.weightCard.comment ||
        previousVisitStatus?.weightComment,
    };
    const length = {
      name: 'Length',
      value: previousVisitStatus?.length,
      color: previousVisitStatus?.lengthColor,
      comment: previousVisitStatus?.lengthComment,
    };
    const muac = {
      name: 'MUAC',
      value: previousVisitStatus?.muac,
      color: previousVisitStatus?.muacColor,
      comment: previousVisitStatus?.muacComment,
    };
    const grow = {
      comment: previousVisitStatus?.growComment,
      color: previousVisitStatus?.growCommentColor,
    };

    return { weight, length, muac, grow };
  }, [
    previousVisitStatus?.growComment,
    previousVisitStatus?.growCommentColor,
    previousVisitStatus?.length,
    previousVisitStatus?.lengthColor,
    previousVisitStatus?.lengthComment,
    previousVisitStatus?.muac,
    previousVisitStatus?.muacColor,
    previousVisitStatus?.muacComment,
    previousVisitStatus?.weight,
    previousVisitStatus?.weightColor,
    previousVisitStatus?.weightComment,
    walkthroughData?.weightCard.color,
    walkthroughData?.weightCard.comment,
    walkthroughData?.weightCard.value,
  ]);

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
          message: `${
            !!caregiverName ? caregiverName + ' &' : ''
          } ${name} need support`,
          value: 50,
        };
      case 'Success':
        return {
          primaryColour: 'successMain',
          secondaryColour: 'successBg',
          message: `${!!caregiverName ? caregiverName + ' &' : ''} ${name} ${
            !!caregiverName ? 'are' : 'is'
          } going well`,
          value: 100,
        };
      case 'Error':
      default:
        return {
          primaryColour: 'errorMain',
          secondaryColour: 'errorBg',
          message: `${
            !!caregiverName ? caregiverName + ' &' : ''
          } ${name} need urgent support`,
          value: 25,
        };
    }
  }, [caregiverName, name, previousVisitStatus?.scoreColor]);

  const getVisitIcon = (visitName: string) => {
    switch (visitName) {
      case activitiesTypes.careForMom:
        return { icon: Pregnant, color: activitiesColours.other.primaryColor };
      case activitiesTypes.careForBaby:
        return { icon: Infant, color: activitiesColours.other.primaryColor };
      case activitiesTypes.pillar1:
        return { icon: P1, color: activitiesColours.pillar1.primaryColor };
      case activitiesTypes.pillar2:
        return { icon: P2, color: activitiesColours.pillar2.primaryColor };
      case activitiesTypes.pillar3:
        return { icon: P3, color: activitiesColours.pillar3.primaryColor };
      case activitiesTypes.pillar4:
        return { icon: P4, color: activitiesColours.pillar4.primaryColor };
      default:
        return { icon: P5, color: activitiesColours.pillar5.primaryColor };
    }
  };

  const groupedData = useMemo(() => {
    if (!!walkthroughData?.infoCard) return walkthroughData.infoCard;

    const groupedData = previousVisitStatus?.visitDataStatus?.reduce(
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
  }, [previousVisitStatus?.visitDataStatus, walkthroughData]) as
    | Status
    | undefined;

  if (
    (!previousVisitStatus?.visitDataStatus?.length &&
      previousVisitStatus?.scoreComment === 'No data available for visit' &&
      !walkthroughData) ||
    (isFromProgressTab && !previousVisit)
  ) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center gap-4">
        <Home />
        <div className="h-24">
          <Typography
            type="h3"
            align="center"
            text={`You haven’t visited ${caregiverName} & ${name} yet`}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex h-16 gap-4"
        id={getStringFromClassNameOrId(progressSteps[0].target)}
      >
        <Typography
          className="w-2/4"
          type="h4"
          text={
            walkthroughData?.progressBar.message || progressBarOptions.message
          }
        />
        <div className="w-2/4">
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
        text={`Here is a summary of how ${name} ${
          !!caregiverName ? '& ' + caregiverName : ''
        } ${!!caregiverName ? 'are' : 'is'} doing`}
      />
      <div id={getStringFromClassNameOrId(progressSteps[1].target)}>
        {(!!walkthroughData?.growCard || !!grow?.comment) && (
          <GrowthCard
            text={walkthroughData?.growCard.comment || grow?.comment || ''}
            color={
              getColorAndIcon(
                walkthroughData?.growCard.color || grow.color || ''
              ).primaryColour
            }
            icon={
              getColorAndIcon(
                walkthroughData?.growCard.color || grow.color || ''
              ).icon
            }
          />
        )}
        {[weight, length, muac].map((item, index) => {
          if (!item.value) return <Fragment key={item.name} />;

          return (
            <Card
              key={item.name}
              className="my-4"
              label={item.name}
              value={item.value || ''}
              date={followUpDate || ''}
              message={item.comment || ''}
              color={item.color as CardProps['color']}
              measure={index === 0 ? 'kg' : 'cm'}
            />
          );
        })}
        <Divider dividerType="dashed" className="mt-4 mb-8" />

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
                  const { icon, color } = getVisitIcon(
                    data?.visitData?.visitName || ''
                  );
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
              text={`${getAge(infant?.user?.dateOfBirth as string)}`}
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
                                      <article className="w-full font-semibold text-black">
                                        {item}
                                      </article>
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
                                      <article className="w-full font-semibold text-black">
                                        {item}
                                      </article>
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
                                      <article className="w-full font-semibold text-black">
                                        {item}
                                      </article>
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
                                      <article className="w-full font-semibold text-black">
                                        {item}
                                      </article>
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
                                <p className=" font-h1 text-alertDark text-sm  font-semibold "></p>
                                <div className="pt-2">
                                  {documentItems?.map((item, indexb) => (
                                    <div className="flex gap-2" key={indexb}>
                                      <article className="w-full font-semibold text-black">
                                        {item}
                                      </article>
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
      </div>
    </>
  );
};
