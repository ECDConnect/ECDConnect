import { Alert, Divider } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, Label } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import LanguageSelector from '@/components/language-selector/language-selector';
// @ts-ignore
import mockedVideo from './mocked.mp4';

export const MotherCareStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  // TODO: add integration
  const isFirstVisit = true;

  // TODO: add integration
  const orangeAlert = {
    message: `${name} had a low birth weight.`,
    list: [
      `Kangaroo Mother Care is especially important for babies like ${name} - it can help them thrive.`,
    ],
  };
  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title="Kangaroo Mother Care"
      />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={
            isFirstVisit
              ? `Watch the video on Kangaroo Mother Care with ${infant?.caregiver?.firstName} and answer any questions.`
              : `Observe how ${infant?.caregiver?.firstName} uses the Kangaroo Mother Care technique with ${name}.`
          }
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              {isFirstVisit ? (
                <PollyNeutral className="h-14 w-14" />
              ) : (
                <Polly className="h-14 w-14" />
              )}
            </div>
          }
        />
        {isFirstVisit && (
          <>
            <LanguageSelector selectLanguage={() => {}} />
            <video src={mockedVideo} controls className="rounded-3xl" />
          </>
        )}
        {!!orangeAlert && (
          <Alert
            type="warning"
            title={orangeAlert.message}
            list={orangeAlert.list}
          />
        )}
        {!isFirstVisit && (
          <>
            <Divider dividerType="dashed" />
            <Label text={`Do you remember how to keep ${name} warm?`} />
            <Divider dividerType="dashed" />
          </>
        )}
      </div>
    </>
  );
};
