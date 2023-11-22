import { Divider, Typography } from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { dateLongMonthOptions } from '../../../timeline/utils';

export const Step1 = ({ setEnableButton, smartStarter }: DynamicFormProps) => {
  const timeline = useSelector(
    getPractitionerTimelineByIdSelector(smartStarter?.id || '')
  );

  const selfAssessment = timeline?.selfAssessmentVisits?.find(
    (item) => !item?.attended
  );

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text="About the self assessment form"
        color="textDark"
      />
      <Typography
        type="h4"
        text={
          selfAssessment?.plannedVisitDate
            ? `Due date: ${new Date(
                selfAssessment?.plannedVisitDate
              ).toLocaleDateString('en-ZA', dateLongMonthOptions)}`
            : `Due date: ${new Date().toLocaleDateString(
                'en-ZA',
                dateLongMonthOptions
              )}`
        }
        color="textMid"
      />
      <Divider dividerType="dashed" className="my-4" />
      <Typography
        type="h4"
        text="Your Club Coach will arrange a time to come and visit your programme."
        color="textDark"
      />
      <Typography
        type="body"
        text={`
        The aim of the visit is to support you to deliver the SmartStart programme. The focus will be on your strengths and abilities, what you can do to build on them.

        This form will help you think about which parts of your SmartStart training you are doing well and if there are any areas that need to get better.

        This form must be completed before your coach’s visit. At the visit, your coach will talk to you about these answers, share ideas, and discuss ways to improve.
        `}
        color="textMid"
      />
    </div>
  );
};
