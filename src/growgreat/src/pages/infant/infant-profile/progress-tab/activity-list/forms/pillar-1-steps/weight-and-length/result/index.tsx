import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { Alert, Colours, Divider, renderIcon, Typography } from '@ecdlink/ui';
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
import { Chart, DataSetType, WeightOrHeightForAgeProps } from './chart';

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

interface GrowthStatus {
  length: VisitData[];
  weight: VisitData[];
}

const Card = ({
  value,
  title,
  subTitle,
  status,
}: {
  value: string;
  title: string;
  subTitle: string;
  status: DataSetType;
}) => {
  const getColor = (): { bg: Colours; main: Colours } => {
    switch (status) {
      case 'SD2':
        return { bg: 'alertBg', main: 'alertMain' };
      case 'SD2neg':
        return { bg: 'alertBg', main: 'alertMain' };
      case 'SD3neg':
        return { bg: 'errorBg', main: 'errorMain' };
      case 'SD3':
        if (title === 'Length') {
          return { bg: 'successBg', main: 'successMain' };
        } else {
          return { bg: 'errorBg', main: 'errorMain' };
        }
      default:
        return { bg: 'successBg', main: 'successMain' };
    }
  };

  return (
    <div
      className={`bg-${
        getColor().bg
      } flex w-full flex-col items-center justify-center rounded-xl p-4`}
    >
      <Typography type="h4" color="textDark" text={title} />
      <Typography
        type="body"
        color={getColor().main}
        className="my-3 text-4xl font-bold"
        text={value}
      />
      <Typography
        type="body"
        color="textMid"
        className="text-xs font-bold"
        text={subTitle}
      />
    </div>
  );
};

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

  const weightIncreased = useMemo(() => {
    let bIncreased = false;
    const weightHistory =
      [
        ...(groupedGrowthData?.weight ? [...groupedGrowthData?.weight] : []),
        ...[weight, ...(infant?.weightAtBirth ? [infant?.weightAtBirth] : [])],
      ] || [];

    if (weightHistory.length > 1) {
      const first2 = weightHistory.slice(0, 2);
      if (weightHistory[0] > weightHistory[1]) {
        bIncreased = true;
      }
    }
    return bIncreased;
  }, [groupedGrowthData, infant]);

  var weightAlertResult = findClosestWeight(
    weightAxios,
    weight,
    findLastIndex(weightResult)
  )[0] as DataSetType;

  // if the new weight is mapped to SD2/SD3 and we don't have a length/height, we default to median to display correct colour and alert
  // EC-917
  if (
    (weightAlertResult === 'SD2' || weightAlertResult === 'SD3') &&
    (length === 0 || height === 0)
  ) {
    weightAlertResult = 'median';
  }

  const lengthOrHeightAlertResult = findClosestWeight(
    lengthAxios,
    length || height,
    findLastIndex(lengthOrHeightResult)
  )[0] as DataSetType;

  const weightMonitoring = useMemo((): GrowthMonitoring['weight'] => {
    switch (weightAlertResult) {
      case 'SD2':
        return { value: 'overweight', statusType: 'warning' };
      case 'SD3':
        return { value: 'obese', statusType: 'warning' };
      case 'SD2neg':
        return { value: 'underweight', statusType: 'warning' };
      case 'SD3neg':
        return { value: 'severely underweight', statusType: 'error' };
      default:
        return { value: 'normal', statusType: 'success' };
    }
  }, [weightAlertResult]);

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
        break;
      case 'SD3':
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
        break;
      case 'SD2neg':
        if (weightIncreased) {
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
        } else {
          WeightAlert = (
            <Alert
              type="warning"
              title={`${name}'s growth is faltering.`}
              customIcon={
                <div className="rounded-full">
                  {renderIcon('ExclamationIcon', 'text-alertMain w-14 h-14')}
                </div>
              }
            />
          );
        }
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
  }, [name, weightAlertResult]);

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
    //let startIndex = Math.max(0, date.indexOf(age) - 4);
    //let endIndex = Math.min(startIndex + 6, date.length);
    //return input.slice(startIndex, endIndex);

    // EC-915 - start x-axis at zero + scale numbers
    // break age into chunks of 6 if age is more than 6
    var maxIndex = age;
    var numberOfChunks = age <= 6 ? age : 6;
    var chunkSize = Math.floor(maxIndex) / numberOfChunks;
    var ageNumbers = [0]; // start with zero
    var counter = 0;
    for (var i = 0; i < numberOfChunks; i++) {
      var max = counter + chunkSize;
      if (i == numberOfChunks) {
        max = maxIndex + 1;
      }
      counter += chunkSize;
      ageNumbers.push(Math.round(max));
    }

    ageNumbers.push(age + 1); // last item is age + 1
    ageNumbers.sort((n1, n2) => n1 - n2);

    // mapping the age chunks to the dataset
    var endResult = [];
    for (var j = 0; j < ageNumbers.length; j++) {
      endResult.push(input[ageNumbers[j]]);
    }
    return endResult;
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
    }

    return (
      <SuccessCard
        text={`${name} is growing well! Great job ${caregiverName}.`}
        color="successMain"
        customIcon={<CelebrateIcon className="h-14	w-14" />}
      />
    );
  }, [
    LengthOrHeightAlert,
    WeightAlert,
    caregiverName,
    height,
    length,
    lengthOrHeightAlertResult,
    name,
    weightAlertResult,
  ]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Growth monitoring"
        subTitle="Weight & length"
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
        <Chart
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
            <Chart
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
