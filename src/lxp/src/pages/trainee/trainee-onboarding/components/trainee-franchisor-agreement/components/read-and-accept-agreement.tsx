import Article from '@/components/article/article';
import { practitionerSelectors } from '@/store/practitioner';
import { Button, Checkbox, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentConsentTypeEnum } from '@ecdlink/core';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
}

export const ReadAndAcceptAgreement: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
}) => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
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
                text={`I, ${practitioner?.user?.fullName}, want to become a SmartStart franchisee so that I can help children in my community to have a brighter future.`}
                type="body"
                color="textMid"
              />
            </div>
            <div className="flex flex-wrap items-start">
              <Checkbox
                // checked={}
                onCheckboxChange={(value) => {}}
              />
              <div className="flex">
                <Typography
                  text={'I accept the'}
                  type="help"
                  color={'textMid'}
                  className="whitespace-nowrap"
                />
                &nbsp;
                <Typography
                  onClick={() => setViewPermissionToShare(true)}
                  className={'cursor-pointer whitespace-nowrap'}
                  text={`conditions and requirements of ${' '}`}
                  underline={true}
                  type="help"
                  color={'secondary'}
                />
              </div>
              <Typography
                onClick={() => setViewPermissionToShare(true)}
                className={'cursor-pointer'}
                text={`becoming a SmartStart franchisee`}
                underline={true}
                type="help"
                color={'secondary'}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 -mb-4 h-full w-full self-end">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="primary"
            text="Next"
            textColor="white"
            icon="ArrowCircleRightIcon"
            onClick={() => setAgreementStep('programmeTypeAgreement')}
          />
        </div>
      </div>
      <Article
        visible={viewPermissionToShare}
        consentEnumType={ContentConsentTypeEnum.FranchiseeAgreement}
        onClose={function (): void {
          setViewPermissionToShare(false);
        }}
      />
    </>
  );
};
