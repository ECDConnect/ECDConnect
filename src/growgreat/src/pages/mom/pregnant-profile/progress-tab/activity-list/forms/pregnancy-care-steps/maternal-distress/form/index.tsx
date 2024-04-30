import { Alert, DialogPosition, Dialog } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { useEffect } from 'react';
import { Video } from '../../../components/video';
import { MoreInformation } from '../../../components/more-information';
import { DynamicFormProps } from '../../../dynamic-form';

export const MaternalDistressVideoStep = ({
  mother,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const sectionName = 'Maternal distress';

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  const name = mother?.user?.firstName;

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <MoreInformation
          subTitle="Maternal distress"
          section="Maternal distress"
          onClose={() => setIsTip?.(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title="Maternal distress"
      />
      <div className="flex flex-col gap-4 p-4">
        <>
          <TipCard
            buttonText="See more info"
            buttonIcon="InformationCircleIcon"
            onClick={() => setIsTip && setIsTip(true)}
          />

          <Alert
            type="warning"
            title={`Watch the video on Maternal Distress with ${name} and answer any questions.`}
            titleColor="textDark"
            customIcon={
              <div className="rounded-full">
                <PollyNeutral className="h-16 w-16" />
              </div>
            }
          />
          <Video section={'Maternal distress video'} />
        </>
      </div>
    </>
  );
};
