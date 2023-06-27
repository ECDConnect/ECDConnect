import { useLayoutEffect, useMemo } from 'react';
import { Alert } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import {
  getInfantCurrentVisitSelector,
  getInfantVisitsSelector,
} from '@/store/infant/infant.selectors';
import { useParams } from 'react-router';
import { InfantProfileParams } from '@/pages/infant/infant-profile/infant-profile.types';
import { RootState } from '@/store/types';

export const NextVisitStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const { visitId } = useParams<InfantProfileParams>();
  const visits = useSelector(getInfantVisitsSelector);
  const currentVisit = useSelector((state: RootState) =>
    getInfantCurrentVisitSelector(state, visitId)
  );
  const nextVisit = visits.find(
    (item) =>
      item.visitType?.order === Number(currentVisit?.visitType?.order) + 1
  );

  const date = nextVisit?.dueDate
    ? new Date(nextVisit?.dueDate).toLocaleDateString('en-ZA', {
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
          title={`${
            caregiverName ? `${caregiverName} & ` : ''
          }${name} need an extra support visit`}
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
