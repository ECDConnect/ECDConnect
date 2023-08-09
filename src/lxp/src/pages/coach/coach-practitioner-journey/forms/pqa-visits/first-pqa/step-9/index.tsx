import { Divider, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { Fragment, useLayoutEffect } from 'react';
import { SelfAssessmentCard } from './card';
import { useSelector } from 'react-redux';
import {
  getPractitionerTimelineByIdSelector,
  getSectionsQuestionsByStep,
} from '@/store/pqa/pqa.selectors';
import {
  selfAssessmentVisitSectionStep2,
  selfAssessmentVisitSectionStep3,
  selfAssessmentVisitSectionStep4,
} from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms/self-assessment';

export const Step9 = ({ setEnableButton, smartStarter }: DynamicFormProps) => {
  const name = smartStarter?.user?.firstName || smartStarter?.firstName;
  const userId = smartStarter?.user?.id || smartStarter?.id || '';
  const timeline = useSelector(getPractitionerTimelineByIdSelector(userId));

  const selfAssessmentVisit = timeline?.selfAssessmentVisits?.[0];

  const previousDataStep2 =
    useSelector(
      getSectionsQuestionsByStep(
        selfAssessmentVisit?.id ?? '',
        'selfAssessmentPreviousFormData',
        selfAssessmentVisitSectionStep2
      )
    )?.questions ?? [];
  const previousDataStep3 =
    useSelector(
      getSectionsQuestionsByStep(
        selfAssessmentVisit?.id ?? '',
        'selfAssessmentPreviousFormData',
        selfAssessmentVisitSectionStep3
      )
    )?.questions ?? [];
  const previousDataStep4 =
    useSelector(
      getSectionsQuestionsByStep(
        selfAssessmentVisit?.id ?? '',
        'selfAssessmentPreviousFormData',
        selfAssessmentVisitSectionStep4
      )
    )?.questions ?? [];

  const data = [
    ...previousDataStep2,
    ...previousDataStep3,
    ...previousDataStep4,
  ];

  const isFilledSelfAssessment = !!data?.length;

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
      {isFilledSelfAssessment ? (
        data?.map((item) => (
          <Fragment key={item.question}>
            <SelfAssessmentCard
              text={item?.question}
              rating={String(item?.answer)}
            />
            <Divider dividerType="dashed" className="my-4" />
          </Fragment>
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
