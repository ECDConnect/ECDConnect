import Article from '@/components/article/article';
import { practitionerSelectors } from '@/store/practitioner';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import { coachSelectors } from '@/store/coach';
import { yesNoOptions } from './startup-accept-agreement3.types';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
}

export const StartupAcceptAgreement4: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
}) => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const coach = useSelector(coachSelectors.getCoach);
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col justify-around p-4">
        <div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'Payment options'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={'Payment options'}
          />
          <div className={'w-full'}>
            <label
              className={
                'font-body text-textMid mb-2 block text-base font-semibold leading-snug'
              }
            >
              Are you the principal/owner of your ECD programme?
            </label>
            <div className="mt-1">
              <ButtonGroup<boolean>
                options={yesNoOptions}
                onOptionSelected={(value: boolean | boolean[]) => {}}
                color="secondary"
                type={ButtonGroupTypes.Button}
                className={'w-full'}
              />
            </div>
          </div>
          <div className="mt-4 mb-16 w-full">
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="primary"
              text="Next"
              textColor="white"
              icon="ArrowCircleRightIcon"
              onClick={() => setAgreementStep('StartupAcceptAgreement3')}
            />
          </div>
        </div>
      </div>
    </>
  );
};
