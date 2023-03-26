import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { Alert, Divider, Typography } from '@ecdlink/ui';
import {
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
import { Chart, WeightOrHeightForAgeProps } from './chart';

import {
  weightAndLengthFormQuestions,
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

import { getAgeInYearsMonthsAndDays } from '@ecdlink/core';
import { differenceInWeeks } from 'date-fns';

const Card = ({
  value,
  title,
  subTitle,
}: {
  value: string;
  title: string;
  subTitle: string;
}) => (
  <div className="bg-successBg flex w-full flex-col items-center justify-center rounded-xl p-4">
    <Typography type="h4" color="textDark" text={title} />
    <Typography
      type="body"
      color="successMain"
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

export const WeightAndLengthResultStep = ({
  infant,
  sectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  // const newObject = {
  //   date: Array.from({ length: 265 }, (_, i) => i + 1),
  //   median: {
  //     label: 'median',
  //     weight: getDataPerWeek(lengthHeightForAgeGirls.median.weight),
  //   },
  //   SD2: {
  //     label: '2 SD',
  //     weight: getDataPerWeek(lengthHeightForAgeGirls.SD2.weight)
  //   },
  //   SD3: {
  //     label: '3 SD',
  //     weight: getDataPerWeek(lengthHeightForAgeGirls.SD3.weight)
  //   },
  //   SD3neg: {
  //     label: '-3 SD',
  //     weight: getDataPerWeek(lengthHeightForAgeGirls.SD3neg.weight)
  //   },
  //   SD2neg: {
  //     label: '-2 SD',
  //     weight: getDataPerWeek(lengthHeightForAgeGirls.SD2neg.weight)
  //   }
  // }

  // function downloadTextFile(text: any, name: string) {
  //   const a = document.createElement('a');
  //   const type = name.split(".").pop();
  //   a.href = URL.createObjectURL( new Blob([text], { type:`text/${type === "txt" ? "plain" : type}` }) );
  //   a.download = name;
  //   a.click();
  // }

  // downloadTextFile(JSON.stringify(newObject), 'data-per-week.json')

  const [weightAxios, setWeightAxios] = useState<WeightOrHeightForAgeProps>();
  const [lengthAxios, setLengthAxios] = useState<WeightOrHeightForAgeProps>();
  const [suffix, setSuffix] = useState<string>('d');

  function getScale(age: number, date: number[], input: number[]) {
    let startIndex = Math.max(0, date.indexOf(age) - 4);
    let endIndex = Math.min(startIndex + 6, date.length);

    return input.slice(startIndex, endIndex);
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

  useLayoutEffect(() => {
    const dateOfBirth = infant?.user?.dateOfBirth as string;
    const gender = infant?.gender?.description;

    const { years, months, days } = getAgeInYearsMonthsAndDays(dateOfBirth);
    const weeks = differenceInWeeks(new Date(), new Date(dateOfBirth));

    const weightPerDay =
      gender === 'Girl' ? weightForAgeGirls : weightForAgeBoys;
    const lengthPerDay =
      gender === 'Girl' ? lengthHeightForAgeGirls : lengthHeightForAgeBoys;
    const weightPerWeek =
      gender === 'Girl' ? weightPerWeekGirls : weightPerWeekBoys;
    const lengthPerWeek =
      gender === 'Girl' ? lengthPerWeekGirls : lengthPerWeekBoys;
    const weightPerMonth =
      gender === 'Girl' ? weightPerMonthGirls : weightPerMonthBoys;
    const lengthPerMonth =
      gender === 'Girl' ? lengthPerMonthGirls : lengthPerMonthBoys;
    const weightPerYear =
      gender === 'Girl' ? weightPerYearGirls : weightPerYearBoys;
    const lengthPerYear =
      gender === 'Girl' ? lengthPerYearGirls : lengthPerYearBoys;

    if (!years && !months && days <= 14) {
      setSuffix('d');
      setLengthAxios(getChartData(days, weightPerWeek));
      return setWeightAxios(getChartData(days, lengthPerWeek));
    }

    if (weeks <= 12) {
      setSuffix('w');
      setLengthAxios(getChartData(weeks, lengthPerDay));
      return setWeightAxios(getChartData(weeks, weightPerDay));
    }

    if (!years && months <= 12) {
      setSuffix('m');
      setLengthAxios(getChartData(months, lengthPerMonth));
      return setWeightAxios(getChartData(months, weightPerMonth));
    }

    setSuffix('y');
    setLengthAxios(getChartData(days, lengthPerYear));
    return setWeightAxios(getChartData(years, weightPerYear));
  }, [getChartData, infant?.gender?.description, infant?.user?.dateOfBirth]);

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const answers = sectionQuestions?.find(
    (section) => section.visitSection === weightAndLengthFormSection
  )?.questions;
  const weight = answers?.find(
    (item) => item.question === weightAndLengthFormQuestions.weight
  )?.answer;
  const length = answers?.find(
    (item) => item.question === weightAndLengthFormQuestions.length
  )?.answer;

  const renderCard = useMemo(() => {
    // TODO: add integration
    return (
      <SuccessCard
        text={`${name} is growing well! Great job ${caregiverName}.`}
        color="successMain"
        customIcon={<CelebrateIcon className="h-14	w-14" />}
      />
    );
  }, [caregiverName, name]);

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
          <Card title="Weight" value={String(weight)} subTitle="KG" />
          <Card title="Length" value={String(length)} subTitle="CM" />
        </div>
        <Typography type="h3" color="textDark" text="Weight for age (kg)" />
        <Chart
          data={weightAxios as WeightOrHeightForAgeProps}
          type="weight"
          suffix={suffix}
        />
        <Divider dividerType="dashed" />
        <Typography type="h3" color="textDark" text="Length for age (cm)" />
        <Chart
          data={lengthAxios as WeightOrHeightForAgeProps}
          type="length"
          suffix={suffix}
        />
      </div>
    </>
  );
};
