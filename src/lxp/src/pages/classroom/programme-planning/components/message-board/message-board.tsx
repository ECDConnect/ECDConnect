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
} from '@ecdlink/ui';
import { DateFormats } from '../../../../../constants/Dates';
import {
  MessageBoardModel,
  messageBoardSchema,
} from '@schemas/classroom/programme-planning/message-board';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageBoardProps } from './message-board.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';

export const MessageBoard: React.FC<MessageBoardProps> = ({
  message,
  date,
  disabled,
  routineItem,
  onClose,
  onSave,
}) => {
  const [displayHelp, setDisplayHelp] = useState(false);
  const { isOnline } = useOnlineStatus();
  const { register, getValues, formState } = useForm<MessageBoardModel>({
    resolver: yupResolver(messageBoardSchema),
    defaultValues: { message },
    mode: 'all',
  });

  const handleSave = () => {
    const formValue = getValues();

    onSave(formValue.message);
  };
  return (
    <>
      <BannerWrapper
        size={'small'}
        title={'Message board'}
        subTitle={date?.toLocaleString('en-za', DateFormats.dayFullMonthYear)}
        displayHelp
        onHelp={() => setDisplayHelp(true)}
        onBack={onClose}
        displayOffline={!isOnline}
      >
        <div className={'bg-uiBg h-full w-full p-4'}>
          <Typography
            type={'body'}
            text={'What messages would you like to share for today?'}
          />
          <FormInput<MessageBoardModel>
            textInputType={'textarea'}
            register={register}
            nameProp={'message'}
            disabled={disabled}
          />
          <Typography
            className={'mt-2'}
            type={'body'}
            fontSize={'18'}
            text={'Message board tips'}
          />
          <Typography
            className={'mt-2'}
            type={'body'}
            text={'Here are some ideas of messages you can share:'}
          />
          <ul className={'ml-6 list-disc'}>
            <li>
              <Typography type={'help'} text={'today’s weather'} />
            </li>
            <li>
              <Typography
                type={'help'}
                text={'an activity we are going to do'}
              />
            </li>
            <li>
              <Typography type={'help'} text={'a story we will share'} />
            </li>
            <li>
              <Typography type={'help'} text={'a visitor for today'} />
            </li>
            <li>
              <Typography type={'help'} text={'an event or outing'} />
            </li>
            <li>
              <Typography type={'help'} text={'someone’s birthday'} />
            </li>
          </ul>
          <Typography
            className={'mt-2'}
            type={'body'}
            text={
              'Create pictures or symbols for each message you would like to share.'
            }
          />

          <Divider className={'my-4'} />
          {!disabled && (
            <Button
              className={'w-full'}
              type={'filled'}
              color={'primary'}
              text={'Save'}
              textColor={'white'}
              icon={'SaveIcon'}
              iconPosition={'start'}
              disabled={formState.isValid === false}
              onClick={handleSave}
            />
          )}
        </div>
      </BannerWrapper>
      <Dialog
        visible={displayHelp}
        position={DialogPosition.Middle}
        className={'mx-4'}
      >
        <ActionModal
          title={routineItem?.name}
          importantText={`${routineItem?.timeSpan}`}
          detailText={routineItem?.description}
          icon={'InformationCircleIcon'}
          iconColor={'infoDark'}
          iconBorderColor={'infoBb'}
          actionButtons={[
            {
              text: 'Close',
              colour: 'primary',
              onClick: () => setDisplayHelp(false),
              type: 'filled',
              textColour: 'white',
              leadingIcon: 'XIcon',
            },
          ]}
        ></ActionModal>
      </Dialog>
    </>
  );
};
