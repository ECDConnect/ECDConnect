import { Divider, Note, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getVisitDataForVisitIdSelectorByUserId } from '@/store/pqa/pqa.selectors';
import {
  callAnswer,
  supportVisitSharedQuestion,
} from '@/pages/coach/coach-practitioner-journey/forms/general-support-visit';
import { useLayoutEffect } from 'react';

import { DynamicFormProps } from '../../dynamic-form';
import { visitIdKey } from '../..';
import { dateLongDayOptions } from '../../../timeline/utils';

export const SupportVisitStep1 = ({
  setEnableButton,
  smartStarter,
}: DynamicFormProps) => {
  const visitId = window.sessionStorage.getItem(visitIdKey) || '';
  const data = useSelector(
    getVisitDataForVisitIdSelectorByUserId(
      smartStarter?.id || '',
      visitId,
      'supportVisitPreviousFormData'
    )
  );
  const note = data?.find(
    (item) => item.question === supportVisitSharedQuestion
  );
  const visitType = data?.find((item) =>
    item.question?.includes('support phone call')
  )?.questionAnswer;
  const isCallAnswer = visitType === callAnswer;

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text={`Coaching ${isCallAnswer ? 'call' : 'visit'}`}
        color="textDark"
      />
      {note && (
        <>
          <Typography
            type="h4"
            text={new Date(note?.insertedDate).toLocaleDateString(
              'en-ZA',
              dateLongDayOptions
            )}
            color="textMid"
          />
          <Divider dividerType="dashed" className="my-4" />
          <Note
            title="Next steps from discussion"
            // TODO: add date
            subTitle="---"
            body={note?.questionAnswer!}
          />
        </>
      )}
    </div>
  );
};
