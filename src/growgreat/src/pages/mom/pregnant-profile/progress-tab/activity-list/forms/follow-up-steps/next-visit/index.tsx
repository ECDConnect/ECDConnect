import { useLayoutEffect, useMemo } from 'react';
import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps, MotherProfileParams } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import { motherSelectors } from '@/store/mother';
import { RootState } from '@/store/types';
import { useParams } from 'react-router';

export const NextVisitStep = ({
  mother,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);

  const { visitId } = useParams<MotherProfileParams>();
  const currentVisit = useSelector((state: RootState) =>
    motherSelectors.getMotherCurrentVisitSelector(state, visitId)
  );
  const motherVisits = useSelector(motherSelectors.getMotherVisits);

  const todayEndOfTheDay = new Date();
  todayEndOfTheDay.setHours(23, 59, 59, 999);
  const nextVisit = motherVisits.find(
    (item) =>
      item.visitType?.order === Number(currentVisit?.visitType?.order) + 1
  );

  const dueDate = nextVisit?.dueDate
    ? new Date(nextVisit.dueDate)
    : todayEndOfTheDay;
  const date = dueDate
    ? dueDate.toLocaleDateString('en-ZA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="CalendarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Next visit"
      />
      <div className="p-4">
        <Alert
          type="warning"
          title={`${name} needs an extra support visit`}
          titleColor="textDark"
          message={`Book a visit before ${date}.`}
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
