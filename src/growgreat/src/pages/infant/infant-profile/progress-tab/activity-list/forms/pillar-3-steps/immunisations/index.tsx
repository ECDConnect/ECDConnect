import { Alert } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header } from '@/pages/infant/infant-profile/components';
import P3 from '@/assets/pillar/p3.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { activitiesColours } from '../../../activities-list';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
import { Video } from '../../components/video';

export const ImmunisationsStep = ({
  infant,
  setEnableButton,
}: DynamicFormProps) => {
  const appDispatch = useAppDispatch();

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const videoSection = 'Pillar 3: Protection - Immunisations';

  const getVideo = useCallback(async () => {
    await appDispatch(
      visitThunkActions.getVisitVideos({
        section: videoSection,
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

  return (
    <>
      <Header
        customIcon={P3}
        title="Immunisations"
        iconHexBackgroundColor={activitiesColours.pillar3.primaryColor}
        hexBackgroundColor={activitiesColours.pillar3.secondaryColor}
      />
      <div className="flex flex-col gap-4 p-4">
        <Alert
          type="warning"
          title={`Show ${caregiverName} the immunisation schedule on page 27 of the Road to Health Booklet.`}
          titleColor="textDark"
          message={`Encourage ${caregiverName} to go to the clinic at 6 weeks for a check up.`}
          messageColor="textMid"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        <Alert
          type="info"
          title={`If ${caregiverName} has the old Road to Health Booklet, show them page 5.`}
        />
        <Alert
          type="warning"
          title={`Watch the video on Immunisation with ${caregiverName} and answer any questions.`}
          titleColor="textDark"
          customIcon={
            <div className="rounded-full">
              <PollyNeutral className="h-16 w-16" />
            </div>
          }
        />
        <Video section={videoSection} />
      </div>
    </>
  );
};
