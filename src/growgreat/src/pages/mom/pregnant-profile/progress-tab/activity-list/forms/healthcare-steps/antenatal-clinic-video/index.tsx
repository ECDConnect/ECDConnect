import { Alert, DialogPosition, Dialog } from '@ecdlink/ui';
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';
import { MoreInformation } from '../../components/more-information';
import { Video } from '../../components/video';
import AntenatalCareSvg from '@/assets/antenatalCare.svg';

export const AntenatalClinicVideoStep = ({
  mother,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const name = mother?.user?.firstName;
  const videoSection = 'Antenatal clinic video';

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <MoreInformation
          section="Antenatal clinic video"
          subTitle="Antenatal clinic video"
          onClose={() => setIsTip?.(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={AntenatalCareSvg}
        title="Antenatal clinic video"
        backgroundColor="tertiary"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="See more info"
          buttonIcon="InformationCircleIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
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
