import { Button, Typography } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';

export const Translations = ({
  onClose,
  toTranslate,
}: {
  onClose: () => void;
  toTranslate: string;
}) => {
  const body = [
    {
      language: 'isiZulu',
      translation: '-',
    },
    {
      language: 'isiXhosa',
      translation: '-',
    },
    {
      language: 'Afrikaans',
      translation: '-',
    },
    {
      language: 'Sepedi',
      translation: '-',
    },
    {
      language: 'Setswana',
      translation: '-',
    },
    {
      language: 'Sesotho',
      translation: '-',
    },
    {
      language: 'Xitsonga',
      translation: '-',
    },
    {
      language: 'siSwati',
      translation: '-',
    },
    {
      language: 'Tshivenda',
      translation: '-',
    },
    {
      language: 'isiNdebele',
      translation: '-',
    },
  ];
  return (
    <>
      <Header
        backgroundColor="infoMain"
        icon="ChatIcon"
        title="Translations"
        subTitle="Danger signs"
      />
      <div className="flex h-full flex-col p-4">
        <Typography type="h4" text={toTranslate} className="mb-6" />
        <table className="text-textDark mb-6 border border-gray-100">
          <thead>
            <tr className="bg-uiBg border-primary border-b text-left">
              <th className={'py-4 px-6'}>Language</th>
              <th>Translation</th>
            </tr>
          </thead>
          <tbody>
            {body.map((item, index) => (
              <tr
                key={`${toTranslate}->${item.language}->${item.translation}`}
                className={index % 2 === 0 ? '' : 'bg-uiBg'}
              >
                <td className={'py-4 px-6'}>{item.language}</td>
                <td>{item.translation}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
