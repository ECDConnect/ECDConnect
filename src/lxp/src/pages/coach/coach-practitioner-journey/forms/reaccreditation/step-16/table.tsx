import { Colours, Typography, classNames } from '@ecdlink/ui';
import { ReactComponent as Emoji1 } from '@/assets/ECD_Connect_emoji1.svg';
import { ReactComponent as Emoji11 } from '@/assets/ECD_Connect_emoji11.svg';
import { ReactComponent as SadRating } from '@/assets/sad_rating.svg';
import { ReactComponent as RedRating } from '@/assets/red_rating.svg';
import { ReactComponent as FourStars } from '@/assets/badges/4stars.svg';
import { ReactComponent as ThreeStars } from '@/assets/badges/3stars.svg';
import { ReactComponent as TwoStars } from '@/assets/badges/2stars.svg';
import { ReactComponent as OneStar } from '@/assets/badges/1star.svg';
import { ReactComponent as ZeroStars } from '@/assets/badges/0stars.svg';

import {
  step15ReAccreditationQuestions,
  step15ReAccreditationVisitSection,
} from '../step-15';
import { DynamicFormProps, Question } from '../../dynamic-form';
import { Rating as RatingType } from '../..';
import { step2ReAccreditationVisitSection } from '../step-2';
import { options } from '../step-2/options';

interface Section {
  questions?: Question[];
  total?: number;
}

export interface TableProps {
  name: string;
  sectionQuestions: DynamicFormProps['sectionQuestions'];
  sections: {
    section1: Section;
    section2: Section;
    section3: Section;
    section4: Section;
  };
  isToRemoveSmartStarter?: boolean;
  isTwoOrangeRatings?: boolean;
  setReAccreditationRating?: (value: RatingType) => void;
}

export const Rating = ({
  name,
  sections,
  sectionQuestions,
  isToRemoveSmartStarter,
  isTwoOrangeRatings,
  setReAccreditationRating,
}: TableProps) => {
  const step2ReAccreditationQuestionAnswers = sectionQuestions?.find(
    (item) => item.visitSection === step2ReAccreditationVisitSection
  )?.questions?.[0]?.answer as string[] | undefined;

  // it's string if it's from the backend
  const step2Answers =
    typeof step2ReAccreditationQuestionAnswers === 'string'
      ? (step2ReAccreditationQuestionAnswers as string)?.split('.,')
      : step2ReAccreditationQuestionAnswers;
  const isBasicSmartSpaceStandardsCompleted =
    step2Answers?.length === options.length;

  const step15Questions = sectionQuestions?.find(
    (item) => item.visitSection === step15ReAccreditationVisitSection
  )?.questions;

  const step15Question1Answer = step15Questions?.find(
    (item) => item.question === step15ReAccreditationQuestions.question1
  )?.answer;
  const step15Question2Answer = step15Questions?.find(
    (item) => item.question === step15ReAccreditationQuestions.question2
  )?.answer;
  const step15Question3Answer = step15Questions?.find(
    (item) => item.question === step15ReAccreditationQuestions.question3
  )?.answer;
  const step15Question4Answer = step15Questions?.find(
    (item) => item.question === step15ReAccreditationQuestions.question4
  )?.answer;

  const getScore = ({ questions, total = 0 }: Section) => {
    const scores = questions
      ?.filter((item) => item.answer !== '')
      .map((item) => {
        if (typeof item.answer === 'string') {
          return Number(item.answer);
        }

        return (item.answer as string[]).length;
      });

    const result = scores?.reduce((total, number) => total + number, 0) ?? 0;
    const percentage = (result / total) * 100;

    let scoreColours: Colours = 'errorMain';
    let icon = '■';
    if (percentage > 28 && percentage <= 74) {
      scoreColours = 'alertMain';
      icon = '▲';
    }

    if (percentage > 74) {
      scoreColours = 'successMain';
      icon = '●';
    }

    return {
      score: result,
      color: scoreColours,
      component: (
        <p className={`text-${scoreColours} font-semibold`}>
          <span
            className={`${
              scoreColours === 'alertMain' ? 'text-xs' : 'text-xl'
            }`}
          >
            {icon}
          </span>{' '}
          {result}/{total}
        </p>
      ),
    };
  };

  const sectionList = [
    getScore(sections.section1),
    getScore(sections.section2),
    getScore(sections.section3),
    getScore(sections.section4),
  ];

  const rating = sectionList
    .map((item) => item.score)
    .reduce((total, number) => total + number, 0);

  const isRedFlagSmartSpaceLicence =
    step15Question1Answer === true || step15Question1Answer === 'true';
  const isRedFlagSmartSpaceCertificateWithdrawn =
    !isBasicSmartSpaceStandardsCompleted;
  const isOrangeQuestion2 =
    step15Question2Answer === false || step15Question2Answer === 'false';
  const isOrangeQuestion3 =
    step15Question3Answer === true || step15Question3Answer === 'true';
  const isOrangeQuestion4 =
    step15Question4Answer === false || step15Question4Answer === 'false';

  const isOrangeFlag =
    rating >= 27 &&
    (isOrangeQuestion2 || isOrangeQuestion3 || isOrangeQuestion4);
  const isOrangeRating = rating >= 13 && rating <= 32;
  const isOrangeCard =
    (isOrangeRating || isOrangeFlag) && !isRedFlagSmartSpaceLicence;
  const isGreenCard =
    rating >= 33 && !isRedFlagSmartSpaceLicence && !isOrangeFlag;

  const body = [
    {
      section: 'A. The learning environment & SmartStart routine',
      score: sectionList[0].component,
    },
    {
      section: 'B. Programme implementation',
      score: sectionList[1].component,
    },
    {
      section: 'C. Records',
      score: sectionList[2].component,
    },
    {
      section: 'D. Operational standards',
      score: sectionList[3].component,
    },
  ];

  const getBadge = () => {
    if (rating >= 39 && !isOrangeFlag) {
      return <FourStars />;
    }
    if (rating >= 33 && rating <= 38 && !isOrangeFlag) {
      return <ThreeStars />;
    }

    if (rating >= 27 && rating <= 32 && !isOrangeFlag) {
      return <TwoStars />;
    }

    if ((rating >= 13 && rating <= 26) || isOrangeFlag) {
      return <OneStar />;
    }

    return <ZeroStars />;
  };

  const getCard = () => {
    if (isGreenCard) {
      setReAccreditationRating?.({ color: 'Success', score: rating });

      return (
        <div className="rounded-10 bg-successBg mb-4 flex items-center p-4">
          <Emoji1 className="mr-2 h-auto w-12" />
          {getBadge()}
          <p
            className={`bg-successDark ml-auto rounded-2xl p-1 font-semibold text-white`}
          >
            {rating}/44
          </p>
        </div>
      );
    }

    if (isOrangeCard) {
      setReAccreditationRating?.({ color: 'Warning', score: rating });

      return (
        <>
          <div className="rounded-10 bg-alertBg mb-4 flex items-center p-4">
            <Emoji11 className="mr-2 h-auto w-12" />
            {getBadge()}
            <p
              className={`bg-alertDark ml-auto rounded-2xl p-1 font-semibold text-white`}
            >
              {rating}/44
            </p>
          </div>
          {isOrangeFlag && (
            <Typography
              type="h4"
              text="Although your score is greater than 1 star, the rating is 1 star because of the following observations:"
            />
          )}
        </>
      );
    }

    setReAccreditationRating?.({ color: 'Error', score: rating });

    return (
      <>
        <div className="rounded-10 bg-errorBg mb-4 flex items-center p-4">
          {isToRemoveSmartStarter || isRedFlagSmartSpaceCertificateWithdrawn ? (
            <>
              <RedRating className="mr-4 h-auto w-12" />
              <Typography
                text="Red rating"
                type="h4"
                className="text-errorDark"
              />
            </>
          ) : (
            <>
              <SadRating className="mr-2 h-auto w-12" />
              {getBadge()}
            </>
          )}
          {!isRedFlagSmartSpaceCertificateWithdrawn && (
            <p
              className={`bg-errorDark ml-auto rounded-2xl p-1 font-semibold text-white`}
            >
              {rating}/44
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {getCard()}
      {(isOrangeQuestion2 || isOrangeQuestion3 || isOrangeQuestion4) &&
        !isTwoOrangeRatings && (
          <ul className="ml-5 mb-4 list-disc">
            {isOrangeQuestion2 && (
              <li className="text-textMid">
                SmartStart programme not implemented for long enough
              </li>
            )}
            {isOrangeQuestion3 && (
              <li className="text-textMid">
                Too many children are attending the programme
              </li>
            )}
            {isOrangeQuestion4 && (
              <li className="text-textMid">
                There are not enough adults for the number of children in the
                programme
              </li>
            )}
          </ul>
        )}
      {isRedFlagSmartSpaceCertificateWithdrawn ? (
        <>
          <Typography
            type="h4"
            color="textDark"
            text={`${name} received an automatic red rating because:`}
          />
          <ul className="ml-5 mb-4 list-disc">
            <li className="text-textMid">
              The programme’s SmartSpace certificate has been withdrawn.
            </li>
          </ul>
        </>
      ) : (
        <table className="text-textDark mb-6 w-full border border-gray-100">
          <thead>
            <tr className="bg-uiBg border-blue-accent3 border-b text-left">
              <th className={'w-3/4 py-4 px-6'}>SECTION</th>
              <th>SCORE</th>
            </tr>
          </thead>
          <tbody>
            {body.map((item, index) => (
              <tr
                key={`${item.section}->${item.score}`}
                className={classNames(
                  'text-sm',
                  index % 2 === 0 ? '' : 'bg-uiBg'
                )}
              >
                <td className={'py-4 px-6'}>{item.section}</td>
                <td className="mt-5 ">{item.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
