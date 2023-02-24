import { Alert, renderIcon } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';
import { MoreInformation } from './more-information';
import LanguageSelector from '@/components/language-selector/language-selector';
// @ts-ignore
import mockedVideo from './mocked.mp4';

export const MaternalDistressStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  // TODO: add integration
  const mockedFollowUp = {
    message: `When you visited ${infant?.caregiver?.firstName} on 12 August 2021, she was experiencing the following:`,
    list: [
      'Felt unable to stop worrying or thinking too much',
      'Felt down, depressed or hopeless',
      'Had thoughts and plans to harm yourself or commit suicide',
    ],
  };

  const isFollowUp = false; // TODO: add integration

  if (isTipPage) {
    return <MoreInformation onClose={() => setIsTip && setIsTip(false)} />;
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title="Maternal distress"
        {...(isFollowUp
          ? {
              subTitle: 'Follow up',
            }
          : {})}
      />
      <div className="flex flex-col gap-4 p-4">
        {isFollowUp ? (
          <>
            <Alert
              type="warning"
              title={mockedFollowUp.message}
              list={mockedFollowUp.list}
              titleColor="textDark"
              customIcon={
                <div className="rounded-full">
                  <PollyTime className="h-16 w-16" />
                </div>
              }
            />
            <Alert
              type="warning"
              title={`Follow up and find out if ${infant?.caregiver?.firstName} got support from the clinic, their friends, or family.`}
              titleColor="alertDark"
              customIcon={
                <div className="rounded-full">
                  {renderIcon(
                    'ExclamationCircleIcon',
                    'text-alertMain w-10 h-10'
                  )}
                </div>
              }
            />
          </>
        ) : (
          <>
            <TipCard
              buttonText="See more info"
              buttonIcon="InformationCircleIcon"
              onClick={() => setIsTip && setIsTip(true)}
            />

            <Alert
              type="warning"
              title={`Watch the video on Maternal Distress with ${infant?.caregiver?.firstName} and answer any questions.`}
              titleColor="textDark"
              customIcon={
                <div className="rounded-full">
                  <PollyNeutral className="h-16 w-16" />
                </div>
              }
            />
            <LanguageSelector selectLanguage={() => {}} />
            <video src={mockedVideo} controls className="rounded-3xl" />
          </>
        )}
      </div>
    </>
  );
};
