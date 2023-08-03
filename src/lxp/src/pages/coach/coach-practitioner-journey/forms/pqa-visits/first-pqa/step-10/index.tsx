import { Divider, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useLayoutEffect } from 'react';
import { Item } from './card';
import { useSelector } from 'react-redux';
import {
  getPractitionerTimelineByIdSelector,
  getSectionsQuestionsByStep,
} from '@/store/pqa/pqa.selectors';
import { selfAssessmentVisitSectionStep5 } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms/self-assessment';
import { selfAssessmentStep5Options } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms/self-assessment/step-5/options';
import { noneOption } from '../step-3/options';

export const Step10 = ({ setEnableButton, smartStarter }: DynamicFormProps) => {
  const name = smartStarter?.user?.firstName || smartStarter?.firstName;
  const practitionerId = smartStarter?.user?.id || smartStarter?.id || '';
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(practitionerId)
  );

  const selfAssessmentVisit = timeline?.selfAssessmentVisits?.[0];

  const previousDataStep5 =
    useSelector(
      getSectionsQuestionsByStep(
        selfAssessmentVisit?.id ?? '',
        'selfAssessmentPreviousFormData',
        selfAssessmentVisitSectionStep5
      )
    )?.questions ?? [];

  const isFilledSelfAssessment = !!previousDataStep5?.length;

  const answers = String(previousDataStep5?.[0]?.answer)?.split(
    ','
  ) as string[];

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="Discuss the self-assessment form"
        color="textDark"
      />
      <Typography
        type="h4"
        text="Go through all of the points below with the franchisee."
        color="textMid"
      />
      <Divider dividerType="dashed" className="my-4" />
      <Typography
        type="h4"
        text="Which activities do you do every day?"
        color="textDark"
      />
      {isFilledSelfAssessment ? (
        selfAssessmentStep5Options
          .filter((item) => item !== noneOption)
          .map((item) => (
            <Item
              text={item}
              checked={answers?.some((answer) => answer === item)}
            />
          ))
      ) : (
        <>
          <Typography
            type="h3"
            text={`${name} did not fill in the self-assessment form on Funda App.`}
            color="textDark"
          />
          <Typography
            type="body"
            text={`If ${name} filled in the paper version of the self-assessment form, please review ${name}’s answers now.`}
            color="textDark"
            className="mt-4"
          />
        </>
      )}
    </div>
  );
};
