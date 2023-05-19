import Article from '@/components/article/article';
import { practitionerSelectors } from '@/store/practitioner';
import { Alert, Button, Checkbox, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import { coachSelectors } from '@/store/coach';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
}

export const StartupAcceptAgreement2: React.FC<ReadAndAcceptAgreementProps> = ({
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
            text={'Read & accept the agreement'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={'**** Name of org/dept giving the start-up support ****'}
          />
          <Alert
            className={'mt-5 mb-3'}
            title="You need to accept both agreements below to continue"
            type={'info'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={
              'Please check to agree with the following and have your signature added:'
            }
          />
          <div className="'flex items-center' w-full flex-row justify-start">
            <div className="flex items-start gap-2">
              <Checkbox
                // checked={}
                onCheckboxChange={(value) => {}}
              />
              <Typography
                text={
                  'The contract will be for a fixed 24 month term, with a monthly value of the start-up subsidy of R 500.00 for a full day programme. I recognise that this amount will be paid monthly into my below mentioned bank account.'
                }
                type="body"
                color={'textMid'}
              />
            </div>
            <div className="mt-2 flex items-start gap-2">
              <Checkbox
                // checked={}
                onCheckboxChange={(value) => {}}
              />
              <Typography
                text={`I recognise that the payment of the monthly start up subsidy depends on the following, and failure to comply on a monthly basis will result in the non-payment of the start-up subsidy:
                1. Submission of the signed monthly register using the method specified by SmartStart by 7th day of each month. Late submission of registers will result in the non-payment of subsidy.
                2. Maintaining and providing stimulation to 6 children monthly.
                3. Non submission of attendance registers for 3 months in a row will lead to termination of this agreement.`}
                type="body"
                color="textMid"
              />
            </div>
          </div>
          <div className="mt-4 h-full w-full">
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
