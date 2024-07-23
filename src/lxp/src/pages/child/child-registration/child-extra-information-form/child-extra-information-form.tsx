import {
  Button,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  ChildExtraInformationFormModel,
  childExtraInformationFormSchema,
} from '@schemas/child/child-registration/child-extra-information-form';
import { staticDataSelectors } from '@store/static-data';
import { ChildExtraInformationFormProps } from './child-extra-information-form.types';

export const ChildExtraInformationForm: React.FC<
  ChildExtraInformationFormProps
> = ({ childExtraInformation, childName, onSubmit }) => {
  const [languagesList, setLanguagesList] = useState<
    ButtonGroupOption<string>[]
  >([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [childGender, setChildGender] = useState<string>();
  const [otherLanguageSelected, setOtherLanguageSelected] = useState<boolean>();
  const gender = useSelector(staticDataSelectors.getGenders);
  const languages = useSelector(staticDataSelectors.getLanguages);

  useEffect(() => {
    if (languages) {
      const languageListToAdd: ButtonGroupOption<string>[] = [];

      languages
        ?.filter((item) => item?.isActive === true)
        ?.forEach((language) => {
          languageListToAdd.push({
            text: language.description ?? '',
            value: language.id ?? '',
          });
        });
      setLanguagesList(languageListToAdd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);

  useEffect(() => {
    if (childExtraInformation) {
      setChildGender(childExtraInformation.genderId);
      setSelectedLanguages(childExtraInformation.homeLanguages || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childExtraInformation]);

  const {
    getValues: getChildExtraInformationFormValues,
    setValue: setChildExtraInformationFormValue,
    register: childExtraInformationFormRegister,
    trigger: triggerChildExtraInformationForm,
  } = useForm<ChildExtraInformationFormModel>({
    resolver: yupResolver(childExtraInformationFormSchema),
    mode: 'onBlur',
    defaultValues: childExtraInformation,
  });

  const handleFormSubmit = () => {
    if (onSubmit) {
      onSubmit(getChildExtraInformationFormValues());
    }
  };

  const handleLanguageSelection = (selectedLanguages: string[]) => {
    setSelectedLanguages(selectedLanguages);
    setChildExtraInformationFormValue('homeLanguages', selectedLanguages);

    const languageOther = languagesList.find((x) => x.text === 'Other');

    if (selectedLanguages.indexOf(languageOther?.value || '-1') !== -1) {
      setOtherLanguageSelected(true);
    } else {
      setOtherLanguageSelected(false);
    }
    triggerChildExtraInformationForm();
  };

  return (
    <div className={'flex h-full flex-col bg-white px-4 pt-2 pb-4'}>
      <Typography type={'h2'} text={childName} color={'primary'} />
      <Typography type={'h4'} text={'Extra Information'} color={'textMid'} />
      <Typography
        type="h4"
        text="Gender"
        color="textDark"
        className="mt-4 mb-2"
      />
      <Typography type="help" text="Optional" color="textMid" />
      <div className={'mt-2'}>
        <ButtonGroup<string>
          options={
            (
              gender &&
              gender
                ?.filter((item) => item?.isActive === true)
                ?.map((x) => {
                  let text = x.description;

                  if (x.description === 'Female') {
                    text = 'Girl';
                  }

                  if (x.description === 'Male') {
                    text = 'Boy';
                  }
                  return { text, value: x.id ?? '' };
                })
            )?.reverse() || []
          }
          onOptionSelected={(value: string | string[]) => {
            setChildExtraInformationFormValue('genderId', value as string);
            setChildGender(value as string);
            triggerChildExtraInformationForm();
          }}
          selectedOptions={childGender}
          color="secondary"
          type={ButtonGroupTypes.Button}
          className={'w-full'}
          multiple={false}
        />
      </div>
      <Typography
        type="h4"
        text={`${childName}’s home language(s)?`}
        color="textDark"
        className="mt-8 mb-2"
      />
      <Typography type="help" text="Optional" color="textMid" />
      <div className={'mt-2'}>
        <ButtonGroup<string>
          type={ButtonGroupTypes.Chip}
          options={languagesList}
          onOptionSelected={(value: string | string[]) =>
            handleLanguageSelection(value as string[])
          }
          multiple
          selectedOptions={selectedLanguages}
          color="secondary"
        />
      </div>
      {otherLanguageSelected && (
        <FormInput<ChildExtraInformationFormModel>
          label={'Please type in other language(s)'}
          className={'mt-3'}
          register={childExtraInformationFormRegister}
          nameProp={'otherLanguages'}
          placeholder={'E.g. Portuguese'}
        />
      )}
      <Button
        onClick={handleFormSubmit}
        className="mt-auto w-full"
        size="small"
        color="quatenary"
        type="filled"
        icon="ArrowCircleRightIcon"
        text="Next"
        textColor="white"
      />
    </div>
  );
};
