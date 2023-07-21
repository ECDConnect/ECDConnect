import { Divider, Note, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import {
  getPractitionerTimelineByIdSelector,
  getVisitDataByVisitIdSelector,
} from '@/store/pqa/pqa.selectors';
import { useLayoutEffect } from 'react';

import { DynamicFormProps } from '../../dynamic-form';
import { dateLongMonthOptions } from '../../../timeline/utils';

export const PrePqaSummaryStep1 = ({
  setEnableButton,
  smartStarter,
}: DynamicFormProps) => {
  const userId = smartStarter?.id || '';

  const timeline = useSelector(getPractitionerTimelineByIdSelector(userId));
  const question = `What next steps or plans to improve did you discuss with {client}?`;
  const prePqaVisits = timeline?.prePQASiteVisits;

  const visit2 = prePqaVisits?.find((item) =>
    item?.visitType?.name?.includes('2')
  );

  const isScheduledVisit2 = !!visit2?.eventId;

  const previousVisit1 = useSelector(
    getVisitDataByVisitIdSelector(
      prePqaVisits?.[0]?.id,
      'prePqaPreviousFormData'
    )
  );
  const previousVisit2 = useSelector(
    getVisitDataByVisitIdSelector(
      prePqaVisits?.[1]?.id,
      'prePqaPreviousFormData'
    )
  );
  const visit1Data = previousVisit1?.find((item) => item.question === question);
  const visit2Data = previousVisit2?.find((item) => item.question === question);

  const notes = visit2Data ? [visit1Data, visit2Data] : [visit1Data];

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text="Pre-PQA site visits" color="textDark" />
      <Typography
        type="h4"
        text="A summary of your discussion with your coach."
        color="textMid"
      />
      <Divider dividerType="dashed" className="my-4" />
      {notes.map((item, index) => (
        <Note
          key={`note-${item?.visitName}`}
          className="mb-4"
          title={`Visit ${index + 1}`}
          subTitle={new Date(item?.insertedDate).toLocaleDateString(
            'en-ZA',
            dateLongMonthOptions
          )}
          body={item?.questionAnswer || '---'}
        />
      ))}
      {!visit2Data && (
        <>
          <Typography
            type="h4"
            text={`Your next visit is ${
              isScheduledVisit2 ? 'scheduled for' : 'due by'
            }:`}
            color="textMid"
          />
          <Typography
            type="h4"
            text={new Date(
              isScheduledVisit2 ? visit2?.plannedVisitDate : visit2?.dueDate
            ).toLocaleDateString('en-ZA', dateLongMonthOptions)}
            color="primary"
          />
        </>
      )}
    </div>
  );
};
