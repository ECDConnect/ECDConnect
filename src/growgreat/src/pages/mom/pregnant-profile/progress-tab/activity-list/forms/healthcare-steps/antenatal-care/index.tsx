import { Alert, Typography, DialogPosition, Dialog } from '@ecdlink/ui';
import AntenatalCareImage from '../../assets/antenatalCareImg.png';
import { Header } from '@/pages/infant/infant-profile/components';
import AntenatalCareSvg from '@/assets/antenatalCare.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect } from 'react';
import { MoreInformation } from '../../components/more-information';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

export const AntenatalCare = ({
  infant,
  mother,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
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
          section="Care for mom"
          subTitle="Care for mom"
          onClose={() => setIsTip?.(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={AntenatalCareSvg}
        title="Antenatal Care"
        subTitle={`${mother?.user?.firstName || ''} ${
          mother?.user?.surname || ''
        }`}
      />
      <img src={AntenatalCareImage} className="w-full" alt="care for mom" />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={`Ask ${mother?.user?.firstName} how she's feeling.`}
          message={`Find out if she has any questions or concerns.`}
          titleColor="textDark"
          messageColor="textMid"
          customIcon={
            <div className="bg-tertiary h-14 w-14 rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
      </div>
      <Typography
        type="body"
        weight="skinny"
        text={`If you don't know how to answer ${mother?.user?.firstName} questions yet, speak to your team leader and follow up with your client as soon as possible.`}
        color="textMid"
        className="px-4 pb-4 pt-2"
      />
    </>
  );
};
