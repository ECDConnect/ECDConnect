import { Alert, DialogPosition, Dialog } from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useEffect, useMemo } from 'react';
import { HealthPromotion } from '../../components/health-promotion';
import { useSelector } from 'react-redux';
import { getIsInfantFirstVisitSelector } from '@/store/infant/infant.selectors';

export const NewbornCareStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const sectionName = 'Newborn care';

  const isFirstVisit = useSelector(getIsInfantFirstVisitSelector);

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${caregiverName}`}
          subTitle={sectionName}
          section={sectionName}
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={sectionName}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />

        <Alert
          type="warning"
          title={
            isFirstVisit
              ? `Show family members how to clean the baby’s eyes and cord.`
              : 'Observe how the mother or family member cleans the baby’s eyes and cord and offer support.'
          }
          titleColor="textDark"
          customIcon={
            <div className="bg-primary rounded-full">
              <Polly className="h-14 w-14" />
            </div>
          }
        />
      </div>
    </>
  );
};
