import { BannerWrapper, Button, Typography, stripPTag } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { visitThunkActions } from '@/store/visit';
import { DangerSignTranslation } from '@ecdlink/graphql';

export const Translations = ({
  onClose,
  toTranslate,
  section,
  id,
}: {
  onClose: () => void;
  toTranslate: string;
  section: string;
  id: string;
}) => {
  const [translations, setTranslations] = useState<DangerSignTranslation[]>([]);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const getContent = useCallback(async () => {
    if (!isOnline) return;
    setTranslations(
      await appDispatch(
        visitThunkActions.getDangerSignsTranslation({
          section,
          toTranslate: id,
        })
      ).unwrap()
    );
  }, [appDispatch, isOnline, section, id]);

  useLayoutEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      title={`Translations`}
      subTitle={'Danger Signs'}
      renderOverflow
      onClose={onClose}
    >
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
            {translations.map((item, index) => (
              <tr
                key={`${toTranslate}->${item.language}->${item.translation}`}
                className={index % 2 === 0 ? '' : 'bg-uiBg'}
              >
                <td className={'py-4 px-6'}>{item.language}</td>
                <td>{stripPTag(item.translation || '')}</td>
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
    </BannerWrapper>
  );
};
