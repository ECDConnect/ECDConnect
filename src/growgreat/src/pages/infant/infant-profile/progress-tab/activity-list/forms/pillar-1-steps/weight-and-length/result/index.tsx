import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { Alert, Divider, renderIcon, Typography } from '@ecdlink/ui';
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { DynamicFormProps } from '../../../dynamic-form';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { GrowthChart } from './chart';
import { DataSetType, WeightOrHeightForAgeProps } from './chart.types';

import {
  weightLengthAndHeightFormQuestions,
  weightAndLengthFormSection,
} from '../form';
import {
  lengthHeightForAgeBoys,
  lengthPerMonthBoys,
  lengthPerYearBoys,
  lengthPerWeekBoys,
  weightPerWeekBoys,
  weightForAgeBoys,
  weightPerMonthBoys,
  weightPerYearBoys,
} from './data/boys';
import {
  lengthHeightForAgeGirls,
  weightPerMonthGirls,
  weightPerYearGirls,
  lengthPerWeekGirls,
  weightPerWeekGirls,
  lengthPerMonthGirls,
  lengthPerYearGirls,
  weightForAgeGirls,
} from './data/girls';

import { getAgeInYearsMonthsAndDays, toCamelCase } from '@ecdlink/core';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';
import { useSelector } from 'react-redux';
import { getGrowthDataForInfantSelector } from '@/store/visit/visit.selectors';
import { VisitData } from '@ecdlink/graphql';
import {
  fillInMissingNumbers,
  findClosestWeight,
  findLastIndex,
} from './data/utils/utils';
import { GrowthMonitoring } from '../..';
import { Card } from './card';
import { GrowthStatus, xAxisData } from './index.types';

export const WeightAndLengthResultStep = ({
  infant,
  sectionQuestions,
  setGrowthMonitoring,
  setEnableButton,
}: DynamicFormProps) => {
  const [weightAxios, setWeightAxios] = useState<WeightOrHeightForAgeProps>();
  const [lengthAxios, setLengthAxios] = useState<WeightOrHeightForAgeProps>();
  const [weightResult, setWeightResult] = useState<(number | undefined)[]>([
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]);
  const [lengthOrHeightResult, setLengthOrHeightResult] = useState<
    (number | undefined)[]
  >([undefined, undefined, undefined, undefined, undefined, undefined]);

  const [suffix, setSuffix] = useState<string>('d');

  const growthData = useSelector(getGrowthDataForInfantSelector);

  const uniqueGrowthData = useMemo(
    () =>
      growthData?.filter((object, index, array) => {
        return (
          index ===
          array.findIndex(
            (newObject) =>
              newObject.visit?.plannedVisitDate ===
                object.visit?.plannedVisitDate &&
              newObject.question === object.question
          )
        );
      }),
    [growthData]
  );

  const groupedGrowthData = useMemo(() => {
    return uniqueGrowthData?.reduce(
      (acc: { [key: string]: any }, currentValue) => {
        const question = toCamelCase(currentValue?.question || '');
        if (!question) return acc;
        if (!acc[question]) {
          acc[question] = [];
        }
        acc[question].push(currentValue);
        return acc;
      },
      {}
    );
  }, [uniqueGrowthData]) as GrowthStatus | undefined;

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const answers = useMemo(
    () =>
      sectionQuestions?.find(
        (section) => section.visitSection === weightAndLengthFormSection
      )?.questions,
    [sectionQuestions]
  );
  const weight = useMemo(
    () =>
      Number(
        answers?.find(
          (item) => item.question === weightLengthAndHeightFormQuestions.weight
        )?.answer || 0
      ),
    [answers]
  );
  const length = useMemo(
    () =>
      Number(
        answers?.find(
          (item) => item.question === weightLengthAndHeightFormQuestions.length
        )?.answer || 0
      ),
    [answers]
  );
  const height = useMemo(
    () =>
      Number(
        answers?.find(
          (item) => item.question === weightLengthAndHeightFormQuestions.height
        )?.answer || 0
      ),
    [answers]
  );

  const _subTitle = useMemo(() => {
    let subTitle = 'Weight & length';

    if (length === 0 && height === 0) {
      subTitle = 'Weight';
    }

    return subTitle;
  }, [length, height]);

  const weightIncreased = useMemo(() => {
    let bIncreased = false;
    var weightHistory: number[] = [];

    // add newly entered weight first
    weightHistory.push(weight);

    // get history of entered values
    if (groupedGrowthData && groupedGrowthData?.weight) {
      for (var i = 0; i < groupedGrowthData?.weight.length; i++) {
        weightHistory.push(
          parseInt(groupedGrowthData?.weight[i].questionAnswer as string)
        );
      }
    }

    // add weight at birth last
    weightHistory.push(infant?.weightAtBirth as number);

    if (weightHistory.length > 1) {
      const first2 = weightHistory.slice(0, 2);

      if (first2[0] > first2[1]) {
        bIncreased = true;
      }
    }

    return bIncreased;
  }, [groupedGrowthData, infant, weight]);

  var weightAlertResult = findClosestWeight(
    weightAxios,
    weight,
    findLastIndex(weightResult)
  )[0] as DataSetType;

  const lengthOrHeightAlertResult = findClosestWeight(
    lengthAxios,
    length || height,
    findLastIndex(lengthOrHeightResult)
  )[0] as DataSetType;

  const weightMonitoring = useMemo((): GrowthMonitoring['weight'] => {
    switch (weightAlertResult) {
      case 'SD2':
        if (length === 0 && height === 0) {
          if (weightIncreased) {
            return { value: 'normal', statusType: 'success' };
          } else {
            return { value: 'growth faltering', statusType: 'warning' };
          }
        }
        return { value: 'overweight', statusType: 'warning' };
      case 'SD3':
        if (length === 0 && height === 0) {
          if (weightIncreased) {
            return { value: 'normal', statusType: 'success' };
          } else {
            return { value: 'growth faltering', statusType: 'warning' };
          }
        }
        return { value: 'obese', statusType: 'warning' };
      case 'SD2neg':
        return { value: 'underweight', statusType: 'warning' };
      case 'SD3neg':
        return { value: 'severely underweight', statusType: 'error' };
      default:
        if (weightIncreased) {
          return { value: 'normal', statusType: 'success' };
        } else {
          return { value: 'growth faltering', statusType: 'warning' };
        }
    }
  }, [weightAlertResult, length, height, weightIncreased]);

  const lengthOrHeightMonitoring = useMemo((): GrowthMonitoring['length'] => {
    switch (lengthOrHeightAlertResult) {
      case 'SD2neg':
        return { value: 'stunted', statusType: 'warning' };
      case 'SD3neg':
        return { value: 'severely stunted', statusType: 'error' };
      default:
        return { value: 'normal', statusType: 'success' };
    }
  }, [lengthOrHeightAlertResult]);

  const WeightAlert = useCallback(() => {
    let WeightAlert = <Fragment />;
    switch (weightAlertResult) {
      case 'SD2':
        // normally showing overweight, but different rules when only weight is available
        if (length === 0 && height === 0) {
          // if weight increased, great, otherwise faltering
          if (weightIncreased) {
            WeightAlert = (
              <Alert
                type="success"
                title={`${name} is growing well! Great job ${caregiverName}.`}
                customIcon={
                  <div className="rounded-full">
                    {renderIcon('ExclamationIcon', 'text-sucessMain w-14 h-14')}
                  </div>
                }
              />
            );
          } else {
            WeightAlert = (
              <Alert
                type="warning"
                title={`${name}'s growth is faltering.`}
                customIcon={
                  <div className="rounded-full">
                    {renderIcon(
                      'ExclamationIcon',
                      'text-warningMain w-14 h-14'
                    )}
                  </div>
                }
              />
            );
          }
        } else {
          WeightAlert = (
            <Alert
              type="warning"
              title={`${name} is overweight.`}
              customIcon={
                <div className="rounded-full">
                  {renderIcon('ExclamationIcon', 'text-alertMain w-14 h-14')}
                </div>
              }
            />
          );
        }
        break;
      case 'SD3':
        // normally showing obese, but different rules when only weight is available
        if (length === 0 && height === 0) {
          // if weight increased, great, otherwise faltering
          if (weightIncreased) {
            WeightAlert = (
              <Alert
                type="success"
                title={`${name} is growing well! Great job ${caregiverName}.`}
                customIcon={
                  <div className="rounded-full">
                    {renderIcon(
                      'ExclamationIcon',
                      'text-successMain w-14 h-14'
                    )}
                  </div>
                }
              />
            );
          } else {
            WeightAlert = (
              <Alert
                type="warning"
                title={`${name}'s growth is faltering.`}
                customIcon={
                  <div className="rounded-full">
                    {renderIcon(
                      'ExclamationIcon',
                      'text-warningMain w-14 h-14'
                    )}
                  </div>
                }
              />
            );
          }
        } else {
          WeightAlert = (
            <Alert
              type="warning"
              title={`${name} is obese.`}
              customIcon={
                <div className="rounded-full">
                  {renderIcon('ExclamationIcon', 'text-alertMain w-14 h-14')}
                </div>
              }
            />
          );
        }
        break;
      case 'SD2neg':
        WeightAlert = (
          <Alert
            type="warning"
            title={`${name} is underweight.`}
            customIcon={
              <div className="rounded-full">
                {renderIcon('ExclamationIcon', 'text-alertMain w-14 h-14')}
              </div>
            }
          />
        );
        break;
      case 'SD3neg':
        WeightAlert = (
          <Alert
            type="error"
            title={`Refer ${name} to the clinic urgently.`}
            list={[`${name} is severely underweight for their age.`]}
            customIcon={
              <div>
                {renderIcon(
                  'ExclamationCircleIcon',
                  'w-14 h-14 text-errorMain'
                )}
              </div>
            }
          />
        );
        break;
      default:
        break;
    }
    return WeightAlert;
  }, [name, weightAlertResult, length, height, caregiverName, weightIncreased]);

  const LengthOrHeightAlert = useCallback(() => {
    let LengthOrHeightAlert = <Fragment />;

    switch (lengthOrHeightAlertResult) {
      case 'SD2neg':
        LengthOrHeightAlert = (
          <Alert
            type="warning"
            title={`${name} is stunted.`}
            customIcon={
              <div className="rounded-full">
                {renderIcon('ExclamationIcon', 'text-alertMain w-14 h-14')}
              </div>
            }
          />
        );
        break;
      case 'SD3neg':
        LengthOrHeightAlert = (
          <Alert
            type="error"
            title={`Refer ${name} to the clinic urgently.`}
            list={[`${name} is severely stunted.`]}
            customIcon={
              <div>
                {renderIcon(
                  'ExclamationCircleIcon',
                  'w-14 h-14 text-errorMain'
                )}
              </div>
            }
          />
        );
        break;
      default:
        break;
    }
    return LengthOrHeightAlert;
  }, [lengthOrHeightAlertResult, name]);

  const {
    lengthPerDay,
    lengthPerMonth,
    lengthPerWeek,
    lengthPerYear,
    weightPerDay,
    weightPerMonth,
    weightPerWeek,
    weightPerYear,
  } = useMemo(() => {
    const gender = infant?.gender?.description;

    const weightPerDay =
      gender === 'Female' ? weightForAgeGirls : weightForAgeBoys;
    const lengthPerDay =
      gender === 'Female' ? lengthHeightForAgeGirls : lengthHeightForAgeBoys;
    const weightPerWeek =
      gender === 'Female' ? weightPerWeekGirls : weightPerWeekBoys;
    const lengthPerWeek =
      gender === 'Female' ? lengthPerWeekGirls : lengthPerWeekBoys;
    const weightPerMonth =
      gender === 'Female' ? weightPerMonthGirls : weightPerMonthBoys;
    const lengthPerMonth =
      gender === 'Female' ? lengthPerMonthGirls : lengthPerMonthBoys;
    const weightPerYear =
      gender === 'Female' ? weightPerYearGirls : weightPerYearBoys;
    const lengthPerYear =
      gender === 'Female' ? lengthPerYearGirls : lengthPerYearBoys;

    return {
      weightPerDay,
      weightPerMonth,
      weightPerWeek,
      weightPerYear,
      lengthPerDay,
      lengthPerWeek,
      lengthPerMonth,
      lengthPerYear,
    };
  }, [infant?.gender?.description]);

  function getScale(age: number, date: number[], input: number[]) {
    // first implementation - not working
    // let startIndex = Math.max(0, date.indexOf(age) - 4);
    // let endIndex = Math.min(startIndex + 6, date.length);
    // return input.slice(startIndex, endIndex);
    return input.slice(0, age + 1);
  }

  const getChartData = useCallback(
    (age: number, input: WeightOrHeightForAgeProps) => {
      return {
        date: getScale(age, input.date, input.date),
        median: {
          label: 'median',
          weight: getScale(age, input.date, input.median?.weight as number[]),
        },
        SD2: {
          label: '2 SD',
          weight: getScale(age, input.date, input.SD2.weight as number[]),
        },
        SD3: {
          label: '3 SD',
          weight: getScale(age, input.date, input.SD3.weight as number[]),
        },
        SD3neg: {
          label: '-3 SD',
          weight: getScale(age, input.date, input.SD3neg.weight as number[]),
        },
        SD2neg: {
          label: '-2 SD',
          weight: getScale(age, input.date, input.SD2neg.weight as number[]),
        },
      };
    },
    []
  );

  const getWeightOrLengthResult = useCallback(
    (
      age: string,
      data: (
        | VisitData
        | {
            visit: {
              plannedVisitDate: Date;
            };
            questionAnswer: number;
          }
      )[],
      dateAxios: number[],
      suffix: 'd' | 'w' | 'm' | 'y',
      result: (number | undefined)[]
    ) => {
      let differenceFunction = (
        dateLeft: number | Date,
        dateRight: number | Date
      ) => 0;

      switch (suffix) {
        case 'd':
          differenceFunction = differenceInDays;
          break;
        case 'w':
          differenceFunction = differenceInWeeks;
          break;
        case 'm':
          differenceFunction = differenceInMonths;
          break;
        default:
          differenceFunction = differenceInYears;
          break;
      }
      const newResult = [...result];

      const formattedResult = data.map((item) => {
        let date = differenceFunction(
          new Date(item.visit?.plannedVisitDate),
          new Date(age)
        );

        const scale = dateAxios;
        const index = scale.indexOf(date);

        if (index === -1) {
          newResult[0] = Number(item?.questionAnswer);

          return newResult;
        }

        if (index !== -1) {
          newResult[index] = Number(item?.questionAnswer);

          return newResult;
        }

        return result;
      })[0];

      return formattedResult;
    },
    []
  );

  const setChartData = useCallback(() => {
    const dateOfBirth = infant?.user?.dateOfBirth as string;

    const weightHistory =
      [
        ...(groupedGrowthData?.weight ? [...groupedGrowthData?.weight] : []),
        ...[
          { visit: { plannedVisitDate: new Date() }, questionAnswer: weight },
          ...(infant?.weightAtBirth
            ? [
                {
                  visit: { plannedVisitDate: new Date(dateOfBirth) },
                  questionAnswer: infant?.weightAtBirth,
                },
              ]
            : []),
        ],
      ] || [];
    const lengthHistory =
      [
        ...(groupedGrowthData?.length ? [...groupedGrowthData?.length] : []),
        ...[
          {
            visit: { plannedVisitDate: new Date() },
            questionAnswer: length || height,
          },
          ...(infant?.lengthAtBirth
            ? [
                {
                  visit: { plannedVisitDate: new Date(dateOfBirth) },
                  questionAnswer: infant?.lengthAtBirth,
                },
              ]
            : []),
        ],
      ] || [];

    const {
      years: ageYears,
      months: ageMonthsPart,
      days: ageDays,
    } = getAgeInYearsMonthsAndDays(dateOfBirth);
    const ageWeeks = differenceInWeeks(new Date(), new Date(dateOfBirth));
    const ageMonths = differenceInMonths(new Date(), new Date(dateOfBirth));

    if (!ageYears && !ageMonthsPart && ageDays <= 14) {
      const weightChartData = getChartData(ageDays, weightPerDay);
      const lengthChartDate = getChartData(ageDays, lengthPerDay);

      setWeightResult(
        fillInMissingNumbers(
          getWeightOrLengthResult(
            dateOfBirth,
            weightHistory,
            weightChartData.date,
            'd',
            weightResult
          )
        )
      );
      setLengthOrHeightResult(
        fillInMissingNumbers(
          getWeightOrLengthResult(
            dateOfBirth,
            lengthHistory,
            lengthChartDate.date,
            'd',
            lengthOrHeightResult
          )
        )
      );
      setSuffix('d');
      setLengthAxios(lengthChartDate);
      return setWeightAxios(weightChartData);
    }

    if (ageWeeks <= 12) {
      const weightChartData = getChartData(ageWeeks, weightPerWeek);
      const lengthChartDate = getChartData(ageWeeks, lengthPerWeek);

      setWeightResult(
        fillInMissingNumbers(
          getWeightOrLengthResult(
            dateOfBirth,
            weightHistory,
            weightChartData.date,
            'w',
            weightResult
          )
        )
      );
      setLengthOrHeightResult(
        fillInMissingNumbers(
          getWeightOrLengthResult(
            dateOfBirth,
            lengthHistory,
            lengthChartDate.date,
            'w',
            lengthOrHeightResult
          )
        )
      );
      setSuffix('w');
      setLengthAxios(lengthChartDate);
      return setWeightAxios(weightChartData);
    }

    if (ageYears < 2) {
      const weightChartData = getChartData(ageMonths, weightPerMonth);
      const lengthChartData = getChartData(ageMonths, lengthPerMonth);

      setWeightResult(
        fillInMissingNumbers(
          getWeightOrLengthResult(
            dateOfBirth,
            weightHistory,
            weightChartData.date,
            'm',
            weightResult
          )
        )
      );
      setLengthOrHeightResult(
        fillInMissingNumbers(
          getWeightOrLengthResult(
            dateOfBirth,
            lengthHistory,
            lengthChartData.date,
            'm',
            lengthOrHeightResult
          )
        )
      );
      setSuffix('m');
      setLengthAxios(lengthChartData);
      return setWeightAxios(weightChartData);
    }

    const weightChartData = getChartData(ageYears, weightPerYear);
    const lengthChartDate = getChartData(ageYears, lengthPerYear);

    setWeightResult(
      fillInMissingNumbers(
        getWeightOrLengthResult(
          dateOfBirth,
          weightHistory,
          weightChartData.date,
          'y',
          weightResult
        )
      )
    );
    setLengthOrHeightResult(
      fillInMissingNumbers(
        getWeightOrLengthResult(
          dateOfBirth,
          lengthHistory,
          lengthChartDate.date,
          'y',
          lengthOrHeightResult
        )
      )
    );
    setSuffix('y');
    setLengthAxios(lengthChartDate);
    return setWeightAxios(weightChartData);

    // I've really put this eslint rule
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getChartData,
    getWeightOrLengthResult,
    groupedGrowthData?.length,
    groupedGrowthData?.weight,
    infant?.user?.dateOfBirth,
  ]);

  useEffect(() => {
    setGrowthMonitoring?.({
      weight: weightMonitoring,
      ...(length
        ? {
            length: lengthOrHeightMonitoring,
          }
        : {}),
      ...(height
        ? {
            height: lengthOrHeightMonitoring,
          }
        : {}),
    });
  }, [
    height,
    length,
    lengthOrHeightMonitoring,
    setGrowthMonitoring,
    weightMonitoring,
  ]);

  useLayoutEffect(() => {
    setChartData();
  }, [setChartData]);

  const renderCard = useMemo(() => {
    if (weightAlertResult === 'median' && !weightIncreased) {
      return (
        <Alert
          type="warning"
          title={`${name}'s growth is faltering.`}
          customIcon={
            <div className="rounded-full">
              {renderIcon('ExclamationIcon', 'text-warningMain w-14 h-14')}
            </div>
          }
        />
      );
    } else {
      if (
        weightAlertResult !== 'median' ||
        ((!!length || !!height) && lengthOrHeightAlertResult !== 'median')
      ) {
        return (
          <>
            <WeightAlert />
            {(!!length || !!height) && <LengthOrHeightAlert />}
          </>
        );
      } else
        return (
          <SuccessCard
            text={`${name} is growing well! Great job ${caregiverName}.`}
            color="successMain"
            customIcon={<CelebrateIcon className="h-14	w-14" />}
          />
        );
    }
  }, [
    LengthOrHeightAlert,
    WeightAlert,
    caregiverName,
    height,
    length,
    lengthOrHeightAlertResult,
    name,
    weightAlertResult,
    weightIncreased,
  ]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  const getMapData = useCallback(
    (question) => {
      var mapData: xAxisData[] = [];

      const dateOfBirth = infant?.user?.dateOfBirth as string;
      const { years: ageYears, days: ageDays } =
        getAgeInYearsMonthsAndDays(dateOfBirth);
      const ageWeeks = differenceInWeeks(new Date(), new Date(dateOfBirth));
      const ageMonths = differenceInMonths(new Date(), new Date(dateOfBirth));
      var _x = 0;
      var i = 0;

      const hasBirthMarkers =
        Number(infant?.weightAtBirth) > 0 || Number(infant?.lengthAtBirth) > 0;

      if (growthData) {
        for (i = 0; i < growthData.length; i++) {
          if (
            (growthData[i].question === question &&
              growthData[i].questionAnswer !== 'undefined' &&
              growthData[i].questionAnswer !== '' &&
              growthData[i].visitName !== 'Care for baby') ||
            (growthData[i].question === question &&
              growthData[i].questionAnswer !== 'undefined' &&
              growthData[i].questionAnswer !== '' &&
              growthData[i].visitName === 'Care for baby' &&
              !hasBirthMarkers)
          ) {
            if (growthData[i].visit?.visitType?.name === 'day_3') {
              _x = 3;
              if (suffix === 'w') {
                _x = 0.3;
              } else if (suffix === 'm') {
                _x = 0.03;
              } else if (suffix === 'y') {
                _x = 0.003;
              }
            } else if (growthData[i].visit?.visitType?.name === 'day_7') {
              _x = 7;
              if (suffix === 'w') {
                _x = 1;
              } else if (suffix === 'm') {
                _x = 0.07;
              } else if (suffix === 'y') {
                _x = 0.007;
              }
            } else if (growthData[i].visit?.visitType?.name === 'week_2') {
              _x = 2;
              if (suffix === 'm') {
                _x = 0.2;
              } else if (suffix === 'y') {
                _x = 0.02;
              }
            } else if (growthData[i].visit?.visitType?.name === 'week_4') {
              _x = 4;
              if (suffix === 'm') {
                _x = 0.4;
              } else if (suffix === 'y') {
                _x = 0.04;
              }
            } else if (growthData[i].visit?.visitType?.name === 'week_7_to_8') {
              _x = 8;
              if (suffix === 'm') {
                _x = 0.8;
              } else if (suffix === 'y') {
                _x = 0.08;
              }
            } else if (growthData[i].visit?.visitType?.name === '3_months') {
              _x = 3;
            } else if (growthData[i].visit?.visitType?.name === '4_months') {
              _x = 4;
            } else if (growthData[i].visit?.visitType?.name === '5_months') {
              _x = 5;
            } else if (growthData[i].visit?.visitType?.name === '6_months') {
              _x = 6;
            } else if (growthData[i].visit?.visitType?.name === '9_months') {
              _x = 9;
            } else if (growthData[i].visit?.visitType?.name === '12_months') {
              _x = 12;
            } else if (growthData[i].visit?.visitType?.name === '15_months') {
              _x = 15;
            } else if (growthData[i].visit?.visitType?.name === '18_months') {
              _x = 18;
            } else if (growthData[i].visit?.visitType?.name === '21_months') {
              _x = 21;
            } else if (growthData[i].visit?.visitType?.name === '24_months') {
              _x = 24;
            } else if (growthData[i].visit?.visitType?.name === '5_years') {
              _x = 5;
            } else if (
              growthData[i].visit?.visitType?.name === 'additional_visits'
            ) {
              var additional_date =
                growthData[i].visit?.plannedVisitDate <
                growthData[i].visit?.actualVisitDate
                  ? new Date(growthData[i].visit?.plannedVisitDate)
                  : new Date(growthData[i].visit?.actualVisitDate);
              var startDate = new Date(dateOfBirth);
              var endDate = addMonths(startDate, ageMonths);
              if (suffix === 'd') {
                endDate = addDays(startDate, ageDays);
                _x = ageDays - differenceInDays(endDate, additional_date);
              } else if (suffix === 'w') {
                endDate = addWeeks(startDate, ageWeeks);
                _x = ageWeeks - differenceInWeeks(endDate, additional_date);
              } else if (suffix === 'm') {
                endDate = addMonths(startDate, ageMonths);
                _x = ageMonths - differenceInMonths(endDate, additional_date);
              } else if (suffix === 'y') {
                endDate = addYears(startDate, ageYears);
                _x = ageYears - differenceInYears(endDate, additional_date);
              }
            }
            mapData.push({
              y: parseFloat(growthData[i].questionAnswer as string),
              x: _x,
              name: growthData[i].visit?.visitType?.name as string,
              date: new Date(growthData[i].visit?.plannedVisitDate),
            });
          }
        }
      }

      return mapData;
    },
    [growthData, infant, suffix]
  );

  const xAxisWeigthMapData = useMemo(() => {
    var mapData: xAxisData[] = getMapData('Weight');
    const dateOfBirth = infant?.user?.dateOfBirth as string;
    const { years: ageYears, days: ageDays } =
      getAgeInYearsMonthsAndDays(dateOfBirth);
    const ageWeeks = differenceInWeeks(new Date(), new Date(dateOfBirth));
    const ageMonths = differenceInMonths(new Date(), new Date(dateOfBirth));

    // add birth weight
    var _y = 0;
    var startDate = new Date(dateOfBirth);
    if (infant?.weightAtBirth != null) {
      _y = infant?.weightAtBirth;
    }
    mapData?.unshift({ y: _y, x: 0, name: 'birth', date: startDate });
    // add new weight
    var _x = 0;
    var endDate: Date = new Date();
    if (suffix === 'd') {
      _x = ageDays;
      endDate = addDays(startDate, ageDays);
    } else if (suffix === 'w') {
      _x = ageWeeks;
      endDate = addWeeks(startDate, ageWeeks);
    } else if (suffix === 'm') {
      _x = ageMonths;
      endDate = addMonths(startDate, ageMonths);
    } else if (suffix === 'y') {
      _x = ageYears;
      endDate = addYears(startDate, ageYears);
    }
    mapData?.push({ y: weight, x: _x, name: 'new', date: endDate });

    // sort on date and then value
    mapData.sort(function (a, b) {
      return a.date.getTime() - b.date.getTime() || a.x - b.x;
    });

    return mapData;
  }, [getMapData, infant, weight, suffix]);

  const xAxisHeightMapData = useMemo(() => {
    var mapData: xAxisData[] = getMapData('Length');

    const dateOfBirth = infant?.user?.dateOfBirth as string;
    const { years: ageYears, days: ageDays } =
      getAgeInYearsMonthsAndDays(dateOfBirth);
    const ageWeeks = differenceInWeeks(new Date(), new Date(dateOfBirth));
    const ageMonths = differenceInMonths(new Date(), new Date(dateOfBirth));

    // add birth length
    var _y = 0;
    var startDate = new Date(dateOfBirth);
    if (infant?.lengthAtBirth != null) {
      _y = infant?.lengthAtBirth;
    }
    mapData?.unshift({ y: _y, x: 0, name: 'birth', date: startDate });
    // add new length
    var _x = 0;
    var endDate: Date = new Date();
    if (suffix === 'd') {
      _x = ageDays;
      endDate = addDays(startDate, ageDays);
    } else if (suffix === 'w') {
      _x = ageWeeks;
      endDate = addWeeks(startDate, ageWeeks);
    } else if (suffix === 'm') {
      _x = ageMonths;
      endDate = addMonths(startDate, ageMonths);
    } else if (suffix === 'y') {
      _x = ageYears;
      endDate = addYears(startDate, ageYears);
    }
    mapData?.push({ y: length || height, x: _x, name: 'new', date: endDate });

    // sort on date and then value
    mapData.sort(function (a, b) {
      return a.date.getTime() - b.date.getTime() || a.x - b.x;
    });

    return mapData;
  }, [getMapData, infant, length, height, suffix]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Growth monitoring"
        subTitle={_subTitle}
      />
      <div className="relative flex flex-col gap-3 p-4">
        <Alert
          type="warning"
          title={`Discuss ${name}'s growth with ${caregiverName}`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
        {renderCard}
        <div className="flex gap-2">
          <Card
            status={weightAlertResult}
            title="Weight"
            value={String(weight)}
            subTitle="KG"
          />
          {(!!length || !!height) && (
            <Card
              status={lengthOrHeightAlertResult}
              title={length ? 'Length' : 'Height'}
              value={String(length || height)}
              subTitle="CM"
            />
          )}
        </div>
        <Typography type="h3" color="textDark" text="Weight for age (kg)" />
        <GrowthChart
          xAxisMapData={xAxisWeigthMapData}
          infantName={name}
          result={weightResult}
          data={weightAxios as WeightOrHeightForAgeProps}
          type="weight"
          suffix={suffix}
        />
        {(!!length || !!height) && (
          <>
            <Divider dividerType="dashed" />
            <Typography
              type="h3"
              color="textDark"
              text={`${length ? 'Length' : 'Height'} for age (cm)`}
            />
            <GrowthChart
              xAxisMapData={xAxisHeightMapData}
              infantName={name}
              result={lengthOrHeightResult}
              data={lengthAxios as WeightOrHeightForAgeProps}
              type="length"
              suffix={suffix}
            />
          </>
        )}
      </div>
    </>
  );
};
