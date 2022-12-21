import { LanguageDto } from '@ecdlink/core';
import { Alert, Button, Divider, Typography, Dropdown } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@/store/static-data';
import {
  initialPractitionerSetupValues,
  practitionerSetupModelSchema,
} from '@/schemas/practitioner/practitioner-setup';
import { getHealthCareWorker } from '@/store/healthCareWorker/healthCareWorker.selectors';
import { useEffect } from 'react';

export const PractitionerSetup = ({
  onSubmit,
}: {
  onSubmit: (item: string) => void;
}) => {
  const languages = useSelector(staticDataSelectors?.getLanguages);
  const { watch, setValue } = useForm({
    resolver: yupResolver(practitionerSetupModelSchema),
    defaultValues: initialPractitionerSetupValues,
  });

  const healthCareWorker = useSelector(getHealthCareWorker);

  const { languageId } = watch();

  useEffect(() => {
    setValue('languageId', healthCareWorker?.languageId);
  }, [healthCareWorker?.languageId, setValue]);

  return (
    <>
      <div className="wrapper-with-sticky-button mt-4">
        <div className="grid gap-4">
          <div>
            <Typography
              type="h2"
              className="inline"
              text="Choose your language"
            />
          </div>
          <div>
            <Divider dividerType="dashed" className="-my-1" />
            <div>
              <label className="text-h3 text-dark  block">
                What language would you like to use on CHW Connect?
              </label>
            </div>
            <Dropdown
              placeholder={'Tap to choose language'}
              list={
                (languages &&
                  languages.map((language: LanguageDto) => {
                    return { label: language.description, value: language.id };
                  })) ||
                []
              }
              fillType="clear"
              fullWidth
              // label={'Language'}
              className="mb-4"
              selectedValue={languageId}
              onChange={(item: any) => {
                setValue('languageId', item);
              }}
            />
            <Alert
              className={'mx-4'}
              type={'info'}
              title={'You can change this language in your profile in future.'}
              list={[
                'If the content is not available in your chosen language, it will be shown in English.',
              ]}
            />
            <Divider dividerType="dashed" className="-my-1" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-h-20 p-4">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="primary"
            text="Next"
            textColor="white"
            icon="ArrowCircleRightIcon"
            disabled={!languageId}
            onClick={() => {
              onSubmit(languageId || '');
            }}
          />
        </div>
      </div>
    </>
  );
};
