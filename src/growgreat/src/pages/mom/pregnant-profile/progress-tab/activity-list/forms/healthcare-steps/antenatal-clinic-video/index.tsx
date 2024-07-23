import { Alert } from '@ecdlink/ui';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';
import { Video } from '../../components/video';
import AntenatalCareSvg from '@/assets/antenatalCare.svg';

export const AntenatalClinicVideoStep = ({
  mother,
  setEnableButton,
}: DynamicFormProps) => {
  const name = mother?.user?.firstName;
  const videoSection = 'Antenatal Clinic';

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={AntenatalCareSvg}
        title="Antenatal Clinic"
        backgroundColor="tertiary"
      />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={`Watch the Antenatal Clinic video with ${name} and answer any questions she has.`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyHappy className="h-16 w-16" />
            </div>
          }
        />
        <Video section={videoSection} />
      </div>
    </>
  );
};
