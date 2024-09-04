import Article from '@/components/article/article';
import { practitionerSelectors } from '@/store/practitioner';
import { Button, Checkbox, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import { contentConsentThunkActions } from '@/store/content/consent';
import { useAppDispatch } from '@/store';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
  franchisorAgreementSigned?: boolean;
}

export const ReadAndAcceptAgreement: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
  franchisorAgreementSigned,
}) => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);
  const [becomeSmartStartuser, setBecomeSmartStartuser] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const updateConsents = async () => {
      await appDispatch(
        contentConsentThunkActions.getConsent({ locale: 'en-za' })
      ).unwrap();
    };

    updateConsents();
  }, []);

  return (
    <>
      <div className="flex flex-col justify-around p-4">
        <div
          className={`${
            franchisorAgreementSigned ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'Read & accept the agreement'}
          />
          <Typography
            className={'my-3 w-full'}
            color={'textDark'}
            type={'h3'}
            text={
              'Please check to agree with the following and have your signature added:'
            }
          />
          <div className="'flex items-center' w-full flex-row justify-start">
            <div
              className="flex items-start gap-2"
              onClick={() => setBecomeSmartStartuser(!becomeSmartStartuser)}
            >
              <Checkbox
                checked={
                  franchisorAgreementSigned
                    ? franchisorAgreementSigned
                    : undefined || becomeSmartStartuser
                }
                onCheckboxChange={() =>
                  setBecomeSmartStartuser(!becomeSmartStartuser)
                }
              />
              <Typography
                text={`I, ${practitioner?.user?.fullName}, want to become a SmartStart franchisee so that I can help children in my community to have a brighter future.`}
                type="body"
                color="textMid"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-start">
              <Checkbox<Boolean>
                checked={
                  franchisorAgreementSigned
                    ? franchisorAgreementSigned
                    : undefined || acceptTerms
                }
                onCheckboxChange={() => setAcceptTerms(!acceptTerms)}
              />
              <div className="flex">
                <Typography
                  text={'I accept the'}
                  type="help"
                  color={'textMid'}
                  className="whitespace-nowrap"
                  onClick={() => setAcceptTerms(!acceptTerms)}
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
            disabled={!becomeSmartStartuser || !acceptTerms}
          />
        </div>
      </div>
      {/* <Article
        visible={viewPermissionToShare}
        consentEnumType={ContentConsentTypeEnum.FranchiseeAgreement}
        onClose={function (): void {
          setViewPermissionToShare(false);
        }}
      /> */}
    </>
  );
};
