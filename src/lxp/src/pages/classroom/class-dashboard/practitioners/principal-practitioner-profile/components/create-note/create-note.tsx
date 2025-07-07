import { NoteDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  Divider,
  FormInput,
  Typography,
  DialogPosition,
  renderIcon,
  classNames,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useAppDispatch } from '@store/config';
import { authSelectors } from '@store/auth';
import { useEffect, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  CreateNoteFormModel,
  createNoteFormSchema,
  defaultCreateNoteFormSchema,
} from '@schemas/child/child-notes/create-note';
import { CreateNoteProps } from './create-notes.types';
import { newGuid } from '@utils/common/uuid.utils';
import { notesActions } from '@store/notes';
import { useStaticData } from '@hooks/useStaticData';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const CreateNote: React.FC<CreateNoteProps> = ({
  noteType,
  userId,
  titleText = 'Add a note',
  onCreated,
  onBack,
}) => {
  const user = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();

  const { getNoteTypeIdByEnum } = useStaticData();

  const appDispatch = useAppDispatch();

  const [confirmGoBackPromptVisible, setConfirmGoBackPromptVisible] =
    useState<boolean>(false);
  const [hasChangesOnNote, setHasChangesOnNote] = useState<boolean>(false);
  const {
    getValues: getNoteFormValues,
    register: noteFormRegister,
    control: noteFormControl,
  } = useForm<CreateNoteFormModel>({
    resolver: yupResolver(createNoteFormSchema),
    mode: 'onChange',
    defaultValues: defaultCreateNoteFormSchema,
  });

  const { isValid } = useFormState({
    control: noteFormControl,
  });

  const { title, body } = useWatch({
    control: noteFormControl,
    defaultValue: defaultCreateNoteFormSchema,
  });

  useEffect(() => {
    if ((title && title.length > 0) || (body && body.length > 0)) {
      setHasChangesOnNote(true);
    } else {
      setHasChangesOnNote(false);
    }
  }, [title, body]);

  const handleFormSubmit = async (formValues: CreateNoteFormModel) => {
    if (isValid) {
      const typeId = await getNoteTypeIdByEnum(noteType);
      const newNoteToSave: NoteDto = {
        id: newGuid(),
        isActive: true,
        name: formValues.title,
        bodyText: formValues.body,
        userId: userId,
        noteTypeId: typeId ?? '',
        createdUserId: user?.id ?? '',
        insertedDate: new Date().toISOString(),
      };

      appDispatch(notesActions.createNote(newNoteToSave));

      if (onCreated) {
        onCreated();
      }
    }
  };

  const exitCreateNote = () => {
    if (onBack) {
      if (hasChangesOnNote) {
        setConfirmGoBackPromptVisible(true);
        setHasChangesOnNote(false);
      } else {
        onBack();
      }
    }
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        backgroundColour={'uiBg'}
        renderBorder={true}
        title={titleText}
        color={'primary'}
        onBack={() => exitCreateNote()}
        displayOffline={!isOnline}
      >
        <Typography
          type={'h1'}
          text={'Create note'}
          color={'primary'}
          className={'px-4 pt-1'}
        />
        <Typography
          type={'h3'}
          text={format(new Date(), 'dd MMM yyyy')}
          color={'textMid'}
          className={'px-4'}
        />
        <div className={'px-4 pt-4'}>
          <FormInput<CreateNoteFormModel>
            label={'Note title'}
            register={noteFormRegister}
            nameProp={'title'}
            hint={'What is this note about?'}
            maxLength={50}
            placeholder={'E.g. November parent meeting'}
          />
          <FormInput<CreateNoteFormModel>
            label={'Add some detail'}
            className={'mt-3'}
            textInputType="textarea"
            register={noteFormRegister}
            nameProp={'body'}
            placeholder={
              'E.g. Themba’s mother shared some information about his health.'
            }
          />
          <div className={'py-4'}>
            <Divider></Divider>
          </div>
          <Button
            onClick={() => handleFormSubmit(getNoteFormValues())}
            className="w-full"
            size="small"
            color="primary"
            type="filled"
            disabled={!isValid}
          >
            {renderIcon('SaveIcon', classNames('h-5 w-5 text-white'))}
            <Typography type="h6" className="ml-2" text="Save" color="white" />
          </Button>
        </div>
      </BannerWrapper>

      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={confirmGoBackPromptVisible}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`You have unsaved changes?`}
          detailText={'If you exit now your changes will not be saved.'}
          actionButtons={[
            {
              text: 'Save note',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => handleFormSubmit(getNoteFormValues()),
              leadingIcon: 'SaveIcon',
            },
            {
              text: 'Exit',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => exitCreateNote(),
              leadingIcon: 'LogoutIcon',
            },
          ]}
        />
      </Dialog>
    </>
  );
};

export default CreateNote;
