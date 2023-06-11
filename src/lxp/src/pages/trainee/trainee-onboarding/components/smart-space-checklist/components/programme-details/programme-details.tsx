import { ContentConsentTypeEnum, ProgrammeTypeDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  ButtonGroup,
  FormInput,
  Typography,
  ButtonGroupTypes,
  renderIcon,
  BannerWrapper,
  Checkbox,
  ImageInput,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useFormState, useWatch, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './programme-details.styles';
import {
  EditProgrammeModel,
  editProgrammeSchema,
} from '@schemas/practitioner/edit-programme';
import { ProgrammeDetailsProps, yesNoOptions } from './programme-details.types';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import Article from '@/components/article/article';
import {
  ProgrammeDetailsModel,
  ProgrammeDetailsSchema,
} from '@/schemas/trainee/programme-details';
import { CommunitySupportSchema } from '@/schemas/trainee/community-support';
import { PhotoPrompt } from '@/components/photo-prompt/photo-prompt';

export const ProgrammeDetails: React.FC<ProgrammeDetailsProps> = ({
  setSectionQuestions,
  setShowProgrammeDetails,
  setVisitSection,
  onSubmit,
}) => {
  const {
    getValues: getProgrammeFormValues,
    setValue: setProgrammeFormValue,
    reset: resetProgrammeFormValue,
    register: programmeFormRegister,
    trigger: triggerR4bForm,
    control: programmeFormControl,
  } = useForm<ProgrammeDetailsModel>({
    resolver: yupResolver(ProgrammeDetailsSchema),
    shouldUnregister: true,
    mode: 'onChange',
  });

  const { isOnline } = useOnlineStatus();
  const { isValid } = useFormState({ control: programmeFormControl });
  const {
    haveReadTheSmartStarterInformation,
    haveTheTitleDeeds,
    ownTheProperty,
    programmeName,
    programmeType,
    unproclaimedLand,
    r4bPhoto,
  } = useWatch<ProgrammeDetailsModel>({
    control: programmeFormControl,
    defaultValue: {},
  });
  const [articleTitle, setArticleTitle] = useState<string>();
  const [presentArticle, setPresentArticle] = useState<boolean>(false);
  const [contentConsentTypeEnum, setContentConsentTypeEnum] =
    useState<ContentConsentTypeEnum>();
  const [r4bPhotoUrl, setR4bPhotoUrl] = useState<string>();
  const [photoActionBarVisible, setPhotoActionBarVisible] =
    useState<boolean>(false);
  const acceptedFormats = ['jpg, bmp'];
  const [displayPhotoDeleteWarning, setDisplayPhotoDeleteWarning] =
    useState<boolean>(false);
  const [questions, setAnswers] = useState([
    {
      question:
        'I have read the SmartStarter Information Sheet on Child Protection and Confidentiality',
      answer: false,
    },
    {
      question: 'What is the name of your programme?',
      answer: '',
    },
    {
      question: ' What type of programme are you running or planning to run?',
      answer: '',
    },
    {
      question: 'Where is your site located?',
      answer: '',
    },
    {
      question:
        'Do you own the property where you will run your SmartStart programme?',
      answer: '',
    },
    {
      question: 'Do you have the Title Deeds for the property?',
      answer: '',
    },
    {
      question: 'Is the property on un-proclaimed land?',
      answer: '',
    },
    {
      question:
        'Take a photo of the filled and signed R4b form - Confirmation of Lease.',
      answer: '',
    },
  ]);
  const visitSection = 'Programme details';

  const programData = useSelector(staticDataSelectors.getProgrammeTypes);

  const displayArticle = async (key: ContentConsentTypeEnum, title: string) => {
    setContentConsentTypeEnum(key);
    setPresentArticle(true);
    setArticleTitle(title);
  };

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
      setSectionQuestions?.([
        {
          visitSection,
          questions: updatedQuestions,
        },
      ]);
    },
    [questions, setSectionQuestions]
  );

  //   useEffect(() => {
  // if(ownTheProperty && unproclaimedLand)
  // // setPhotoActionBarVisible(true)
  //   }, [ownTheProperty, unproclaimedLand])

  const setPhotoUrl = (imageUrl: string) => {
    setProgrammeFormValue('r4bPhoto', imageUrl);

    setR4bPhotoUrl(imageUrl);
    triggerR4bForm();
    setPhotoActionBarVisible(false);
  };

  const enableDeletePhotoWarning = () => {
    setDisplayPhotoDeleteWarning(true);
    setPhotoActionBarVisible(false);
  };

  const closeDeletePhotoWarning = () => {
    setDisplayPhotoDeleteWarning(false);
  };

  const deleteBirthDocumentPhoto = () => {
    setProgrammeFormValue('r4bPhoto', '');
    setR4bPhotoUrl('');
    setDisplayPhotoDeleteWarning(false);
  };

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Programme details'}
        subTitle={'Step 1 of 4'}
        color={'primary'}
        onBack={() => setShowProgrammeDetails(false)}
        displayOffline={!isOnline}
        renderOverflow={true}
      >
        <div className="p-4">
          <Typography
            type={'h2'}
            text={'Programme details'}
            color={'textDark'}
            className={'my-3'}
          />
          <Typography
            type={'h4'}
            text={'Child protection and confidentiality'}
            color={'textDark'}
            className={'my-3'}
          />
          <div className="flex items-center">
            <div className="'flex items-center' w-full flex-row justify-start">
              <div
                className="flex items-start gap-2"
                onClick={() =>
                  onOptionSelected(
                    !getProgrammeFormValues()
                      .haveReadTheSmartStarterInformation,
                    0
                  )
                }
              >
                <Checkbox<ProgrammeDetailsModel>
                  register={programmeFormRegister}
                  nameProp={'haveReadTheSmartStarterInformation'}
                ></Checkbox>
                <Typography
                  text={questions?.[0].question}
                  type="body"
                  color={'textMid'}
                />
              </div>
            </div>
            <Typography
              type={'body'}
              text={'View'}
              color={'secondary'}
              className={'my-3'}
              underline={true}
              onClick={() => {
                displayArticle(
                  ContentConsentTypeEnum.TermsAndConditions,
                  'Terms & Conditions'
                );
              }}
            />
          </div>

          <div className="mt-2 space-y-4">
            <>
              <FormInput<ProgrammeDetailsModel>
                label={questions?.[1].question}
                register={programmeFormRegister}
                nameProp={'programmeName'}
                placeholder={'E.g. Little Lambs Preschool'}
                type={'text'}
                onChange={(e) =>
                  onOptionSelected((e.target as HTMLInputElement).value, 1)
                }
              ></FormInput>

              <div className={'w-full'}>
                <label className={styles.label}>
                  {questions?.[2].question}
                </label>
                <div className="mt-1">
                  <Controller
                    name={'programmeType'}
                    control={programmeFormControl}
                    render={({ field: { onChange, value, ref } }) => (
                      <ButtonGroup<string | string[]>
                        inputRef={ref}
                        options={
                          (programData &&
                            programData.map((x: ProgrammeTypeDto) => {
                              return { text: x.description, value: x.id ?? '' };
                            })) ||
                          []
                        }
                        multiple={false}
                        onOptionSelected={(e) => {
                          setProgrammeFormValue('programmeType', e as string);
                          onOptionSelected(e, 2);
                        }}
                        selectedOptions={value}
                        color="secondary"
                        type={ButtonGroupTypes.Button}
                        className={'w-full'}
                      />
                    )}
                  ></Controller>
                </div>
              </div>

              <FormInput<ProgrammeDetailsModel>
                label={questions?.[3].question}
                register={programmeFormRegister}
                nameProp={'programmeAddress'}
                placeholder={'Tap to add address'}
                type={'text'}
                onChange={(e) =>
                  onOptionSelected((e.target as HTMLInputElement).value, 3)
                }
              ></FormInput>

              <div className={'w-full'}>
                <label className={styles.label}>
                  {questions?.[4].question}
                </label>
                <div className="mt-1">
                  <ButtonGroup<boolean | undefined>
                    options={yesNoOptions}
                    onOptionSelected={(value: any) => {
                      setProgrammeFormValue(
                        'ownTheProperty',
                        value as boolean,
                        {
                          shouldValidate: true,
                        }
                      );
                      onOptionSelected(value, 4);
                    }}
                    selectedOptions={[getProgrammeFormValues().ownTheProperty]}
                    color="secondary"
                    type={ButtonGroupTypes.Button}
                    className={'w-full'}
                  />
                </div>
              </div>

              {ownTheProperty === true && (
                <div className={'w-full'}>
                  <label className={styles.label}>
                    {questions?.[5].question}
                  </label>
                  <div className="mt-1">
                    <ButtonGroup<boolean | undefined>
                      options={yesNoOptions}
                      onOptionSelected={(value: any) => {
                        setProgrammeFormValue(
                          'haveTheTitleDeeds',
                          value as boolean,
                          {
                            shouldValidate: true,
                          }
                        );
                        onOptionSelected(value, 5);
                      }}
                      selectedOptions={[
                        getProgrammeFormValues().haveTheTitleDeeds,
                      ]}
                      color="secondary"
                      type={ButtonGroupTypes.Button}
                      className={'w-full'}
                    />
                  </div>
                </div>
              )}
            </>
            {haveTheTitleDeeds === false && (
              <div className={'w-full'}>
                <label className={styles.label}>
                  {questions?.[6].question}
                </label>
                <div className="mt-1">
                  <Controller
                    name="unproclaimedLand"
                    control={programmeFormControl}
                    render={({ field: { onChange, value, ref } }) => (
                      <ButtonGroup<boolean>
                        inputRef={ref}
                        options={yesNoOptions}
                        onOptionSelected={(value: any) => {
                          setProgrammeFormValue(
                            'unproclaimedLand',
                            value as boolean,
                            {
                              shouldValidate: true,
                            }
                          );
                          onOptionSelected(value, 6);
                        }}
                        selectedOptions={value}
                        color="secondary"
                        type={ButtonGroupTypes.Button}
                        className={'w-full'}
                      />
                    )}
                  />
                </div>
              </div>
            )}

            {haveTheTitleDeeds === true && (
              <ImageInput<ProgrammeDetailsModel>
                acceptedFormats={acceptedFormats}
                label={questions?.[7].question}
                nameProp="r4bPhoto"
                icon="CameraIcon"
                className={'py-4'}
                currentImageString={r4bPhotoUrl}
                register={programmeFormRegister}
                overrideOnClick={() => setPhotoActionBarVisible(true)}
                onValueChange={(imageString: string) => {
                  setProgrammeFormValue('r4bPhoto', imageString);
                  triggerR4bForm();
                }}
              ></ImageInput>
            )}

            {unproclaimedLand === false && (
              <Alert
                className="mb-4"
                type="warning"
                title={`Apply to your municipality for a copy of the title deeds.`}
                list={[
                  'You will need to get a copy of the title deeds in order to complete this section.',
                  'Once you have the title deeds, answer “Yes” to the Title Deeds question above and add a photo of the document.',
                ]}
              />
            )}
            <div>
              <div>
                <Button
                  type="filled"
                  color="primary"
                  className={styles.button}
                  disabled={!isValid}
                  onClick={() => {
                    // setSectionQuestions(questions)
                    setVisitSection(visitSection);
                    onSubmit();
                  }}
                >
                  {renderIcon('SaveIcon', styles.icon)}
                  <Typography
                    type={'help'}
                    text={'Save & continue'}
                    color={'white'}
                  />
                </Button>
              </div>
              <div>
                <Button
                  type="outlined"
                  color="primary"
                  className={styles.button}
                  disabled={!isValid}
                  onClick={() => {}} // Navigate to a different page if it is principle
                >
                  {renderIcon('SaveIcon', styles.icon)}
                  <Typography
                    type={'help'}
                    text={'Save & exit'}
                    color={'primary'}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </BannerWrapper>
      {contentConsentTypeEnum && (
        <Article
          consentEnumType={contentConsentTypeEnum}
          visible={presentArticle}
          title={articleTitle}
          onClose={() => setPresentArticle(false)}
          isOpen={true}
        />
      )}
      <Dialog
        visible={photoActionBarVisible}
        position={DialogPosition.Bottom}
        stretch
      >
        <div className={'p-4'}>
          <PhotoPrompt
            title={'R4b photo'}
            onClose={() => setPhotoActionBarVisible(false)}
            onAction={(imageUrl: string) => {
              setPhotoUrl(imageUrl);
              onOptionSelected(imageUrl, 7);
            }}
            onDelete={() => deleteBirthDocumentPhoto()}
          ></PhotoPrompt>
        </div>
      </Dialog>
    </>
  );
};
