import InfoService from '@/services/InfoService/InfoService';
import { authSelectors } from '@/store/auth';
import { coachSelectors } from '@/store/coach';
import { staticDataSelectors } from '@/store/static-data';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import {
  formatStringWithFirstLetterCapitalized,
  useSnackbar,
} from '@ecdlink/core';
import { MoreInformation } from '@ecdlink/graphql';
import { Button, MoreInformationPage, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface InfoPageProps {
  onClose: () => void;
}
export const InfoPage = ({ onClose }: InfoPageProps) => {
  const [data, setData] = useState<MoreInformation[]>();
  const [selectedLanguage, setSelectedLanguage] = useState('en-za');

  const [isLoading, setIsLoading] = useState(false);

  const userAuth = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const coach = useSelector(coachSelectors.getCoach);

  const { showMessage } = useSnackbar();

  const section = 'ideas-for-making-a-profit';

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

  useEffect(() => {
    setIsLoading(true);
    new InfoService()
      .getMoreInformation(section, selectedLanguage)
      .then((info) => {
        setData(info);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [section, selectedLanguage, userAuth]);

  return (
    <>
      <MoreInformationPage
        isClosable={false}
        isLoading={isLoading}
        languages={languages.map((x) => ({
          value: x.locale,
          label: x.description,
        }))}
        moreInformation={!!data ? data[0] : {}}
        title={formatStringWithFirstLetterCapitalized(section)}
        onClose={onClose}
        setSelectedLanguage={setSelectedLanguage}
      >
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
      </MoreInformationPage>
    </>
  );
};
