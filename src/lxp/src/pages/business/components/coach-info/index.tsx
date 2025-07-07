import { coachSelectors } from '@/store/coach';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { useSnackbar } from '@ecdlink/core';
import { Button, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';

export const CoachInfo = () => {
  const coach = useSelector(coachSelectors.getCoach);

  const { showMessage } = useSnackbar();

  const whatsAppNumber = coach?.user?.whatsappNumber;
  const phoneNumber = coach?.user?.phoneNumber;

  const onWhatsapp = () => {
    if (whatsAppNumber) {
      return window.open(`whatsapp://send?text=${whatsAppNumber}`);
    }

    return showMessage({
      message: 'WhatsApp number is not available',
      type: 'error',
    });
  };

  const onCall = () => {
    if (phoneNumber) {
      return window.open(`tel:${phoneNumber}`);
    }

    return showMessage({
      message: 'Phone number is not available',
      type: 'error',
    });
  };

  return (
    <>
      <Typography
        type="h3"
        text="Contact your coach for support"
        color="textDark"
      />
      <Typography
        type="body"
        text={`${coach?.user?.firstName}’s Phone number:`}
        color="textMid"
      />
      <Typography
        type="body"
        text={phoneNumber || whatsAppNumber || '000 000 0000'}
        color="primary"
      />
      <div className="mt-4 flex  flex-wrap gap-4">
        <Button color="primary" type="outlined" onClick={onWhatsapp}>
          <div className="flex items-center justify-center">
            <img
              src={getLogo(LogoSvgs.whatsapp)}
              alt="whatsapp"
              className="text-primary mr-1 h-5 w-5"
            />
            <Typography
              text={`Whatsapp ${coach?.user?.firstName}`}
              type="button"
              weight="skinny"
              color="primary"
            />
          </div>
        </Button>
        <Button
          icon="PhoneIcon"
          type="outlined"
          color="primary"
          textColor="primary"
          text={`Call ${coach?.user?.firstName}`}
          onClick={onCall}
        />
      </div>
    </>
  );
};
