import Article from '@/components/article/article';
import { practitionerSelectors } from '@/store/practitioner';
import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Dialog,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentConsentTypeEnum, ProgrammeTypeDto } from '@ecdlink/core';
import { Controller, useForm } from 'react-hook-form';
import { staticDataSelectors } from '@/store/static-data';
import {
  EditProgrammeModel,
  editProgrammeSchema,
} from '@/schemas/practitioner/edit-programme';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { ModelInfo } from './components/model-info';
import { ProgrammeTypeTexts } from './components/modelTexts';

interface ProgrammeTypeAgreementProps {
  setAgreementStep: any;
  setNotificationStep: any;
}

export const ProgrammeTypeAgreement: React.FC<ProgrammeTypeAgreementProps> = ({
  setAgreementStep,
  setNotificationStep,
}) => {
  const {
    getValues: getProgrammeFormValues,
    setValue: setProgrammeFormValue,
    register: programmeFormRegister,
    control: programmeFormControl,
    handleSubmit,
  } = useForm<EditProgrammeModel>({
    resolver: yupResolver(editProgrammeSchema),
    shouldUnregister: true,
    mode: 'onChange',
  });

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [openModelInfo, setOpenModelInfo] = useState<boolean>(false);
  const programData = useSelector(staticDataSelectors.getProgrammeTypes);
  const history = useHistory();
  const [modelType, setModelType] = useState('');

  const handleSetInfoModelPage = (model: string) => {
    setOpenModelInfo(true);
    setModelType(model);
  };

  const renderInfoPage = (page: string) => {
    switch (page) {
      case 'a':
        return (
          <ModelInfo
            setOpenModelInfo={setOpenModelInfo}
            modelTypeObject={ProgrammeTypeTexts?.ModelA}
          />
        );
      case 'b':
        return (
          <ModelInfo
            setOpenModelInfo={setOpenModelInfo}
            modelTypeObject={ProgrammeTypeTexts?.ModelB}
          />
        );
      case 'c':
        return (
          <ModelInfo
            setOpenModelInfo={setOpenModelInfo}
            modelTypeObject={ProgrammeTypeTexts?.ModelC}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col justify-around p-4">
        <div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'Programme type agreement'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={'See information about each model:'}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className={'mt-1 mb-3 w-min'}
            type="outlined"
            color="primary"
            background={'transparent'}
            size="small"
            onClick={() => handleSetInfoModelPage('a')}
            icon="ArrowNarrowRightIcon"
            iconPosition="start"
          >
            <Typography
              type="buttonSmall"
              color="primary"
              text={'Model A - Playgroups'}
              className="whitespace-nowrap"
            ></Typography>
          </Button>
          <Button
            className={'mt-1 mb-3 w-min'}
            type="outlined"
            color="primary"
            background={'transparent'}
            size="small"
            onClick={() => handleSetInfoModelPage('b')}
            icon="ArrowNarrowRightIcon"
            iconPosition="start"
          >
            <Typography
              type="buttonSmall"
              color="primary"
              text={'Model B - Day mothers'}
              className="whitespace-nowrap"
            ></Typography>
          </Button>
          <Button
            className={'mt-1 mb-3 w-min'}
            type="outlined"
            color="primary"
            background={'transparent'}
            size="small"
            onClick={() => handleSetInfoModelPage('c')}
            icon="ArrowNarrowRightIcon"
            iconPosition="start"
          >
            <Typography
              type="buttonSmall"
              color="primary"
              text={'Model C - Preschools / ECD centres'}
              className="whitespace-nowrap"
            ></Typography>
          </Button>
        </div>
        <div className={'w-full'}>
          <label
            className={
              'font-body text-textMid mb-2 block text-base font-semibold leading-snug'
            }
          >
            What type of programme are you running or planning to run?
          </label>
          <div className="mt-1">
            <Controller
              name={'type'}
              control={programmeFormControl}
              render={({ field: { onChange, value, ref } }) => (
                <ButtonGroup<string>
                  inputRef={ref}
                  options={
                    (programData &&
                      programData.map((x: ProgrammeTypeDto) => {
                        return { text: x.description, value: x.id ?? '' };
                      })) ||
                    []
                  }
                  onOptionSelected={onChange}
                  selectedOptions={value}
                  color="secondary"
                  type={ButtonGroupTypes.Button}
                  className={'w-full'}
                />
              )}
            ></Controller>
          </div>
        </div>
        <div className="mt-4 -mb-4 h-full w-full self-end">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="primary"
            text="Save"
            textColor="white"
            icon="SaveIcon"
            onClick={() => setNotificationStep('')}
          />
        </div>
      </div>
      <Dialog
        visible={openModelInfo}
        stretch={true}
        position={DialogPosition.Full}
      >
        <div>{renderInfoPage(modelType)}</div>
      </Dialog>
    </>
  );
};
