import { Alert, DialogPosition, Dialog } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { HealthPromotion } from '../../components/health-promotion';
import { getPregnancyDay } from '@/utils/mom/pregnant.utils';

export const BirthPreparationStep = ({
  mother,
  setEnableButton,
  setIsTip,
  isTipPage,
}: DynamicFormProps) => {
  const visitSection = 'Birth preparation & emergency planning';
  const name = mother?.user?.firstName;

  const pregnancyDay = getPregnancyDay(mother?.expectedDateOfDelivery!);

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

  const message =
    pregnancyDay > 196
      ? `Discuss ${name} birthing plan. Ask if they have discussed this with family.`
      : `Discuss what plans ${name} has made for the birth of her baby.`;

  return (
    <>
      <Header
        customIcon={Pregnant}
        title="Birth preparation & emergency planning"
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
          title={message}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyNeutral className="h-16 w-16" />
            </div>
          }
        />
      </div>
    </>
  );
};
