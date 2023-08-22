import { Colours, Typography, classNames } from '@ecdlink/ui';
import { DynamicFormProps, Question } from '../../../dynamic-form';
import { ReactComponent as Emoji1 } from '@/assets/ECD_Connect_emoji1.svg';
import { ReactComponent as Emoji11 } from '@/assets/ECD_Connect_emoji11.svg';
import { ReactComponent as RedRating } from '@/assets/red_rating.svg';
import {
  step16Question2,
  step16Question3,
  step16VisitSection,
} from '../step-16';
import { step14VisitSection } from '../step-14';
import { step14CertificateQuestion } from '../step-14';
import { Rating as RatingType } from '../../..';
import { step12VisitSection } from '../step-12';

interface Section {
  questions?: Question[];
  total?: number;
}

export interface TableProps {
  sectionQuestions: DynamicFormProps['sectionQuestions'];
  sections: {
    section1: Section;
    section2: Section;
    section3: Section;
    section4: Section;
    section5: Section;
    section6: Section;
  };
  setPqaRating?: (value: RatingType) => void;
}

export const Rating = ({
  sections,
  sectionQuestions,
  setPqaRating,
}: TableProps) => {
  const step12Answer = sectionQuestions?.find(
    (item) => item.visitSection === step12VisitSection
  )?.questions[0].answer as string[];
  const step14Question1Answer = sectionQuestions
    ?.find((item) => item.visitSection === step14VisitSection)
    ?.questions.find(
      (item) => item.question === step14CertificateQuestion
    )?.answer;
  const step16Question2Answer = sectionQuestions
    ?.find((item) => item.visitSection === step16VisitSection)
    ?.questions.find((item) => item.question === step16Question2)?.answer;
  const step16Question3Answer = sectionQuestions
    ?.find((item) => item.visitSection === step16VisitSection)
    ?.questions.find((item) => item.question === step16Question3)?.answer;

  const getScore = ({ questions, total = 0 }: Section) => {
    const scores = questions
      ?.filter((item) => item.answer !== '')
      .map((item) => Number(String(item?.answer)?.split(' - ')[0]));

    const result = scores?.reduce((total, number) => total + number, 0) ?? 0;
    const percentage = (result / total) * 100;
    let scoreColours: Colours = 'errorMain';
    let icon = '■';
    if (percentage > 26 && percentage < 61) {
      scoreColours = 'alertMain';
      icon = '▲';
    }

    if (percentage >= 62) {
      scoreColours = 'successMain';
      icon = '●';
    }

    return {
      score: result,
      color: scoreColours,
      component: (
        <p className={`text-${scoreColours} font-semibold`}>
          <span className="text-xl">{icon}</span> {result}/{total}
        </p>
      ),
    };
  };

  const sectionList = [
    getScore(sections.section1),
    getScore(sections.section2),
    getScore(sections.section3),
    getScore(sections.section4),
    getScore(sections.section5),
    getScore(sections.section6),
  ];

  const isRedFlagScoreLess5 = sectionList[2].score < 5;
  // eslint-disable-next-line eqeqeq
  const isRedFlagSmartSpaceLicence = step14Question1Answer == false;
  const isRedFlagSmartSpaceCheck = step12Answer?.length < 12;
  // eslint-disable-next-line eqeqeq
  const isOrangeFlagProgramme = step16Question2Answer == false;
  // eslint-disable-next-line eqeqeq
  const isOrangeFlagManyChildren = step16Question3Answer == true;

  const body = [
    {
      section: '1. A stimulating & adequately resourced learning environment',
      score: sectionList[0].component,
    },
    {
      section: '2. Consistent use of the SmartStart routine',
      score: sectionList[1].component,
    },
    {
      section:
        '3. A stable & nurturing environment where children feel safe & loved',
      score: sectionList[2].component,
    },
    {
      section:
        '4. Positive & plentiful adult-child interactions which encourage a rich use of section',
      score: sectionList[3].component,
    },
    {
      section:
        '5. Opportunities for child-directed, open-ended play, supported & directed by adults',
      score: sectionList[4].component,
    },
    {
      section:
        '6. Interactive storytelling which introduces children to new language & learning',
      score: sectionList[5].component,
    },
  ];

  const rating = sectionList
    .map((item) => item.score)
    .reduce((total, number) => total + number, 0);

  const getCard = () => {
    const isOrangeFlag =
      rating > 42 && (isOrangeFlagProgramme || isOrangeFlagManyChildren);
    const isOrangeRating = rating >= 18 && rating <= 42;
    const isOrangeCard =
      (isOrangeRating || isOrangeFlag) &&
      !isRedFlagSmartSpaceLicence &&
      !isRedFlagSmartSpaceCheck &&
      !isRedFlagScoreLess5;

    if (
      rating > 42 &&
      !isRedFlagSmartSpaceCheck &&
      !isRedFlagSmartSpaceLicence &&
      !isRedFlagScoreLess5 &&
      !isOrangeFlag
    ) {
      setPqaRating?.({ color: 'Success', score: rating });
      return (
        <div className="rounded-10 bg-successBg mb-4 flex items-center p-4">
          <Emoji1 className="mr-2 h-auto w-12" />
          <Typography
            text="Green rating"
            type="h4"
            className="text-successDark"
          />
          <p
            className={`bg-successDark ml-auto rounded-2xl p-1 font-semibold text-white`}
          >
            {rating}/68
          </p>
        </div>
      );
    }

    if (isOrangeCard) {
      setPqaRating?.({ color: 'Warning', score: rating });
      return (
        <>
          <div className="rounded-10 bg-alertBg mb-4 flex items-center p-4">
            <Emoji11 className="mr-2 h-auto w-12" />
            <Typography
              text="Orange rating"
              type="h4"
              className="text-alertDark"
            />
            <p
              className={`bg-alertDark ml-auto rounded-2xl p-1 font-semibold text-white`}
            >
              {rating}/68
            </p>
          </div>
          {isOrangeFlag && (
            <Typography
              type="h4"
              text="Although the PQA score is green, the overall rating is orange because of the following observations:"
            />
          )}
        </>
      );
    }

    setPqaRating?.({ color: 'Error', score: rating });
    return (
      <>
        <div className="rounded-10 bg-errorBg mb-4 flex items-center p-4">
          <RedRating className="mr-2 h-auto w-12" />
          <Typography text="Red rating" type="h4" className="text-errorDark" />
          <p
            className={`bg-errorDark ml-auto rounded-2xl p-1 font-semibold text-white`}
          >
            {rating}/68
          </p>
        </div>
        {(isRedFlagSmartSpaceLicence || isRedFlagSmartSpaceCheck) && (
          <Typography
            type="h4"
            text={`Although the PQA score is ${
              isOrangeRating ? 'orange' : 'green'
            }, the overall rating is red because of the following observations:`}
          />
        )}
      </>
    );
  };

  return (
    <>
      {getCard()}
      {(isRedFlagScoreLess5 ||
        isRedFlagSmartSpaceLicence ||
        isRedFlagSmartSpaceCheck ||
        isOrangeFlagProgramme ||
        isOrangeFlagManyChildren) && (
        <ul className="ml-5 mb-4 list-disc">
          {isRedFlagSmartSpaceLicence && (
            <li className="text-textMid">SmartSpace certificate withdrawn</li>
          )}
          {isRedFlagScoreLess5 && (
            <li className="text-textMid">Score for Part 3 was less than 5</li>
          )}
          {isOrangeFlagProgramme && (
            <li className="text-textMid">
              SmartStart programme not implemented for long enough
            </li>
          )}
          {isOrangeFlagManyChildren && (
            <li className="text-textMid">
              Too many children are attending the programme
            </li>
          )}
        </ul>
      )}
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
    </>
  );
};
