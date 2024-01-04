import {
  Button,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  classNames,
  Divider,
  Dropdown,
  DropDownOption,
  FormInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  ChildExtraInformationFormModel,
  childExtraInformationFormSchema,
} from '@schemas/child/child-registration/child-extra-information-form';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './child-extra-information-form.styles';
import { ChildExtraInformationFormProps } from './child-extra-information-form.types';

export const ChildExtraInformationForm: React.FC<
  ChildExtraInformationFormProps
> = ({ childExtraInformation, childName, onSubmit }) => {
  const [racesList, setRacesList] = useState<DropDownOption<string>[]>([]);
  const [languagesList, setLanguagesList] = useState<
    ButtonGroupOption<string>[]
  >([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [childGender, setChildGender] = useState<string>();
  const [otherLanguageSelected, setOtherLanguageSelected] = useState<boolean>();
  const gender = useSelector(staticDataSelectors.getGenders);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const races = useSelector(staticDataSelectors.getRaces);

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
    if (races) {
      const racesListToAdd: DropDownOption<string>[] = [];

      races.forEach((race) => {
        racesListToAdd.push({
          label: race.description ?? '',
          value: race.id ?? '',
        });
      });
      setRacesList(racesListToAdd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [races]);

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
    control: childExtraInformationFormControl,
    trigger: triggerChildExtraInformationForm,
  } = useForm<ChildExtraInformationFormModel>({
    resolver: yupResolver(childExtraInformationFormSchema),
    mode: 'onBlur',
    defaultValues: childExtraInformation,
  });

  const { isValid } = useFormState({
    control: childExtraInformationFormControl,
  });

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
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
    <div className={'h-full bg-white px-4 pt-2 pb-4'}>
      <Typography type={'h1'} text={childName} color={'primary'} />
      <Typography type={'h2'} text={'Extra Information'} color={'textMid'} />
      <div>
        <Dropdown
          placeholder={'Select race'}
          list={racesList}
          fillType="clear"
          label={'Race'}
          fullWidth
          className={'mt-3 w-full'}
          selectedValue={getChildExtraInformationFormValues().race}
          onChange={(item: string) => {
            setChildExtraInformationFormValue('race', item);
            triggerChildExtraInformationForm();
          }}
        />

        <label className={classNames(styles.label, 'mt-4')}>{'Sex'}</label>
        <div className={'mt-2'}>
          <ButtonGroup<string>
            options={
              (gender &&
                gender
                  ?.filter((item) => item?.isActive === true)
                  ?.map((x) => {
                    return { text: x.description, value: x.id ?? '' };
                  })) ||
              []
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
        <label className={classNames(styles.label, 'mt-4')}>
          {`${childName}’s home language(s)?`}
        </label>
        <label className="text-textLight mt-2 text-sm">
          You can choose more than one
        </label>
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
        <div className={'py-4'}>
          <Divider></Divider>
        </div>
        <Button
          onClick={handleFormSubmit}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          disabled={!isValid}
        >
          {renderIcon('ArrowCircleRightIcon', 'h-5 w-5 text-white')}
          <Typography type="h6" className="ml-2" text="Next" color="white" />
        </Button>
      </div>
    </div>
  );
};
