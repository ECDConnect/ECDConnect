import { Alert, Divider, Typography } from '@ecdlink/ui';
import { Header, Label } from '@/pages/infant/infant-profile/components';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { DynamicFormProps } from '../../../../dynamic-form';
import P1 from '@/assets/pillar/p1.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import {
  breastfeedingIssuesCheckboxOptions,
  breastfeedingIssuesCheckboxQuestion,
} from '../breastfeeding-issues';

interface Item {
  id: number;
  title: string;
  descriptions: string[];
}

export const BreastfeedingIssuesRelevantItemsStep = ({
  sectionQuestions: questions,
  setEnableButton,
}: DynamicFormProps) => {
  const [selectedItems, setSelectedItems] = useState<Item[]>();

  const answers = questions
    ?.map((section) =>
      section.questions.find(
        (question) => question.question === breastfeedingIssuesCheckboxQuestion
      )
    )
    .map((question) => question?.answer)[0] as string[];

  const items = useMemo(
    (): Item[] => [
      {
        id: 1,
        title: breastfeedingIssuesCheckboxOptions.soreNipples,
        descriptions: [
          'Usually from poor positioning and incorrect latching. ',
          'Express milk and rub on nipples (helps heal nipples)',
          'Air dry nipples after feeds',
          'Avoid soap on cracked nipples (dries them out)',
          'Don’t use baby jelly (Vaseline) or other products on nipples as this is bad for baby',
        ],
      },
      {
        id: 2,
        title: breastfeedingIssuesCheckboxOptions.lowMilkSupply,
        descriptions: [
          'Make sure baby is in the right position and latched well',
          'Breastfeed more often and longer',
          'Avoid giving formula or other foods or fluids before 6 months',
          'Don’t use artificial teats and/or dummies/pacifiers as baby won’t latch properly',
        ],
      },
      {
        id: 3,
        title: breastfeedingIssuesCheckboxOptions.engorged,
        descriptions: ['Feed baby more often'],
      },
      {
        id: 4,
        title: breastfeedingIssuesCheckboxOptions.clusterFeeding,
        descriptions: [
          'Cluster feeding is when a baby wants to feed often, especially in the evening',
          'This is normal and could be a growth spurt',
          'These make baby to want to breastfeed longer and more often',
          'Babies have many growth spurts in the first year',
          'Growth spurts happen at 3 weeks, 6 weeks and 3 months',
        ],
      },
    ],
    []
  );

  const onPopulateScreen = useCallback(
    () =>
      answers.filter((answer) => {
        const result = items.find((item) => item.title === answer);

        return (
          result &&
          setSelectedItems((prevState) =>
            prevState ? [...prevState, result] : [result]
          )
        );
      }),
    [answers, items]
  );

  useEffect(() => {
    if (!answers) return;

    onPopulateScreen();
  }, [answers, onPopulateScreen]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Breastfeeding issues"
      />
      <div className="flex flex-col p-4">
        <Alert
          className="mt-4"
          type="warning"
          title="Provide support and advice – refer to page 4 & 5 of Road to Health Book."
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        {selectedItems?.map((item) => (
          <Fragment key={item.id}>
            <Typography
              type="h4"
              text={item.title}
              color="black"
              className="my-4"
            />
            {item.descriptions.map((description) => (
              <Fragment key={`${description}-${item.id}`}>
                <Label text={description} />
                <Divider className="my-2" dividerType="dashed" />
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </>
  );
};
