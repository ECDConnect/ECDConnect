import { Alert, Button, FormInput, Typography } from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { Fragment, useEffect, useMemo } from 'react';
import { HealthPromotion } from './health-promotion';

export const FormulaMilkNotesStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  // TODO: add integration (G5.3.11)
  const mockedNote = {
    name: 'Notes from 12 March visit',
    type: 'formula milk only',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };
  // TODO: add integration (G5.3.11)
  const isPreviousNote = true;

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <HealthPromotion
        clientName={caregiverName}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Formula milk only"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`Discuss formula feeding with ${caregiverName}.`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        <FormInput
          label="Add a note"
          subLabel="Optional"
          className={'mt-3'}
          textInputType="textarea"
          placeholder={'E.g. Not able to breastfeed for health reasons.'}
        />
        {isPreviousNote && (
          <>
            <div className="bg-uiBg rounded-15 flex flex-col gap-2 p-4">
              <Typography type="h3" text={mockedNote.name} color="textDark" />
              <div className="flex">
                <Typography
                  type="body"
                  text="Feeding type:"
                  color="textMid"
                  weight="bold"
                  className="pr-1"
                />
                <Typography
                  type="body"
                  text={mockedNote.type}
                  color="textMid"
                />
              </div>
              <div className="flex">
                <Typography
                  type="body"
                  text="Your note:"
                  color="textMid"
                  weight="bold"
                  className="w-36"
                />
                <Typography
                  type="body"
                  text={mockedNote.note}
                  color="textMid"
                />
              </div>
            </div>
            <Button
              type="outlined"
              color="primary"
              textColor="primary"
              text="See previous notes"
              icon="DocumentTextIcon"
            />
          </>
        )}
      </div>
    </>
  );
};
