import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Alert, CheckboxChange, CheckboxGroup, Typography } from '@ecdlink/ui';
import { toCamelCase } from '@ecdlink/core';
import { Header } from '@/pages/infant/infant-profile/components';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import { getReferralsForMotherSelector } from '@/store/mother/mother.selectors';
import { VisitDataStatus } from '@ecdlink/graphql';

interface GroupedData {
  [key: string]: VisitDataStatus[];
  clinicReferrals: VisitDataStatus[];
  departmentOfHomeAffairsReferrals: VisitDataStatus[];
  immunisationsSupplementsAndDeworming: VisitDataStatus[];
}
export const ReferralsStep = ({
  mother,
  setEnableButton,
  setReferralsInput,
}: DynamicFormProps) => {
  const referralsForMother = useSelector(getReferralsForMotherSelector);
  const referrals = referralsForMother?.filter((object, index, array) => {
    return (
      index ===
      array.findIndex((newObject) => newObject.comment === object.comment)
    );
  });

  const groupedData = useMemo(() => {
    const groupedData = referrals?.reduce(
      (acc: { [key: string]: VisitDataStatus[] }, currentValue) => {
        const section = toCamelCase(currentValue?.section || '');
        if (!section) return acc;
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push(currentValue);
        return acc;
      },
      {}
    );

    return groupedData;
  }, [referrals]) as GroupedData;

  const sections =
    groupedData &&
    Object.keys(groupedData)?.map((item) => ({
      label: groupedData[item][0].section,
      value: item,
    }));

  const [questions, setAnswers] = useState(groupedData);

  const name = useMemo(() => mother?.user?.firstName || '', [mother]);

  const visitSection = 'Referrals';

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedAnswers = currentQuestion?.map((question) => {
        if (question.id === value.id) {
          return value;
        }

        return question;
      });

      const updatedQuestions = { ...questions, [index]: updatedAnswers };

      const formattedQuestions = updatedAnswers.map((item) => {
        const { id, isCompleted } = item;

        return { id, isCompleted };
      });

      setReferralsInput?.(formattedQuestions);
      setAnswers(updatedQuestions);
    },
    [questions, setReferralsInput]
  );

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      const referral = questions[event.name].find(
        (item) => item.comment === event.value
      );

      return onOptionSelected(
        { ...referral, isCompleted: event.checked },
        event.name
      );
    },
    [onOptionSelected, questions]
  );

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="CalendarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title={visitSection}
      />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title="Once you’ve written a referral on paper for the concerns below, tap the box."
          titleColor="textDark"
          list={[
            `If you would like to write your referrals later, you can see this list on ${name}'s profile.`,
          ]}
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        {sections?.map((section) => (
          <Fragment key={section.value}>
            <Typography type="h3" text={section.label || ''} color="textDark" />
            {questions?.[section.value].map((item: VisitDataStatus) => (
              <CheckboxGroup
                checkboxColor="primary"
                id={item?.id}
                key={item?.id}
                title={item?.comment || ''}
                titleColours="textMid"
                checked={item?.isCompleted}
                name={section?.value || ''}
                value={item?.comment || ''}
                onChange={(event) => onCheckboxChange(event)}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </>
  );
};
