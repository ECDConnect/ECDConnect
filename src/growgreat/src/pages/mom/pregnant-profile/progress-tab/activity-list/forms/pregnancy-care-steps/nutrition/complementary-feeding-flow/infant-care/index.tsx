import { Alert } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
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
  const appDispatch = useAppDispatch();

  const visitSection = 'Infant care';
  const name = mother?.user?.firstName;

  const getVideo = useCallback(async () => {
    await appDispatch(
      visitThunkActions.getVisitVideos({
        section: visitSection,
        locale: 'en-za',
      })
    );
  }, [appDispatch]);

  useLayoutEffect(() => {
    getVideo();
  }, [getVideo]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <HealthPromotion
        title={`Discuss with ${name}`}
        subTitle={visitSection}
        section={visitSection}
        client={name}
        onClose={() => setIsTip && setIsTip(false)}
      />
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
        <Video section={visitSection} />
      </div>
    </>
  );
};
