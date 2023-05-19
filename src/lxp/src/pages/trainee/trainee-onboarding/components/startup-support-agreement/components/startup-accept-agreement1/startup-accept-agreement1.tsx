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

export const StartupAcceptAgreement1: React.FC<ReadAndAcceptAgreementProps> = ({
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
            title="You need to accept all 3 agreements below to continue"
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
                text={`I, ${practitioner?.user?.fullName} (ID: ${practitioner?.user?.idNumber}; Cellphone: ${practitioner?.user?.phoneNumber}) have set up my own enterprise, with the following site standard number: XYZ and am committed to providing early childhood development services to a maximum of 6 children, from 8am - 6pm, Monday to Friday for the next 24 months at the site, ${coach?.siteAddress?.addressLine1}, ${coach?.siteAddress?.addressLine2}, ${coach?.siteAddress?.addressLine3}.`}
                type="body"
                color="textMid"
              />
            </div>
            <div className="mt-2 flex items-start gap-2">
              <Checkbox
                // checked={}
                onCheckboxChange={(value) => {}}
              />
              <Typography
                text={
                  'I acknowledge that the start-up support is an opportunity to enable me to kick start an early childhood development enterprise and will only be provided if I continue to deliver childcare services to a maximum of 6 children each month.'
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
                text={
                  'I further acknowledge that the funding is provided subject to the following requirements being met and maintained: Registered the required number of children – maximum of 6 children. Registered the required number of children – maximum of 6 children.'
                }
                type="body"
                color={'textMid'}
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
              onClick={() => setAgreementStep('StartupAcceptAgreement2')}
            />
          </div>
        </div>
      </div>
    </>
  );
};
