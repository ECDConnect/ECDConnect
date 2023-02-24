import { Button } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import LanguageSelector from '@/components/language-selector/language-selector';

export const HealthPromotion = ({
  clientName,
  onClose,
}: {
  clientName: string;
  onClose: () => void;
}) => {
  return (
    <>
      <Header
        backgroundColor="infoMain"
        icon="ChatIcon"
        title={`Discuss with ${clientName}`}
        subTitle="Newborn care"
      />
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector selectLanguage={() => {}} />
      </div>
      <div className="flex h-full flex-col p-4">
        Coming soon
        <Button
          className="mt-auto"
          type="filled"
          color="primary"
          textColor="white"
          text="Close"
          icon="XIcon"
          onClick={onClose}
        />
      </div>
    </>
  );
};
