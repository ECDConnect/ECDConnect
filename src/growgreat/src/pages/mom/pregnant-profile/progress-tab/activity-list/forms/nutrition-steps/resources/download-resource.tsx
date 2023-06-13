import { Button } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import LanguageSelector from '@/components/language-selector/language-selector';
import resourceImg from './dietarydiversity2.jpg';

export const DownloadResource = ({ onClose }: { onClose: () => void }) => {
  const onDownloadImage = () => {
    const imageUrl = resourceImg;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.setAttribute('download', 'infographic.jpg');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <Header
        backgroundColor="infoMain"
        icon="ChatIcon"
        title="Share the infographic"
      />
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector selectLanguage={() => {}} />
      </div>
      <div className="flex h-full flex-col p-4">
        <img
          alt="infographic"
          className="mb-8 h-auto w-full object-cover"
          src={resourceImg}
        />
        <Button
          className="mt-auto mb-4"
          type="filled"
          color="primary"
          textColor="white"
          text="Share resource"
          icon="DownloadIcon"
          onClick={onDownloadImage}
        />
        <Button
          className="mt-auto"
          type="outlined"
          color="primary"
          textColor="primary"
          text="Close"
          icon="XIcon"
          onClick={onClose}
        />
      </div>
    </>
  );
};
