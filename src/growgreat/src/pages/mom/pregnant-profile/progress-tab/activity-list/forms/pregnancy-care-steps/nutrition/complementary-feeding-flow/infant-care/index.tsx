import { Alert, DialogPosition, Dialog } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import { useEffect } from 'react';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { DynamicFormProps } from '../../../../dynamic-form';
import { HealthPromotion } from '../../../../components/health-promotion';
import { Video } from '../../../../components/video';

export const InfantCareStep = ({
  mother,
  setEnableButton,
  setIsTip,
  isTipPage,
}: DynamicFormProps) => {
  const visitSection = 'Infant care';
  const name = mother?.user?.firstName;

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
        <HealthPromotion
          title={`Discuss with ${name}`}
          subTitle={visitSection}
          section={visitSection}
          client={name}
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={Pregnant}
        title={visitSection}
        backgroundColor="tertiary"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`Watch the Benefits of Breastfeeding video with ${name} and answer any questions she may have.`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyNeutral className="h-16 w-16" />
            </div>
          }
        />
        <Video section={'Benefits of Breastfeeding 2'} />
      </div>
    </>
  );
};
