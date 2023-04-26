import { useLayoutEffect, useMemo } from 'react';
import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import { motherSelectors } from '@/store/mother';
import { format } from 'date-fns';

export const NextVisitStep = ({
  mother,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);

  const currentVisit = useSelector(
    motherSelectors.getMotherCurrentVisitSelector
  );
  const currentVisitId = currentVisit?.id;
  const motherVisits = useSelector(motherSelectors.getMotherVisits);
  const motherVisitsId = motherVisits?.map((item) => item?.id);

  const currentVisitIndex = motherVisitsId?.indexOf(currentVisitId!);

  const nextVisitIndex = currentVisitIndex + 1;
  const date = motherVisits[nextVisitIndex]?.plannedVisitDate;

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="CalendarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Progress"
      />
      <div className="p-4">
        <Alert
          type="warning"
          title={`${name} needs an extra support visit`}
          titleColor="textDark"
          message={`Book a visit before ${format(
            new Date(date),
            'd MMM yyyy'
          )}.`}
          messageColor="textMid"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
      </div>
    </>
  );
};
