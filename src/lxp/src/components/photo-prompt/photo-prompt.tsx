import {
  getImageSourceFromFileSystem,
  renderIcon,
  ActionSelect,
  ActionSelectItem,
  ComponentBaseProps,
  Camera,
  Button,
  Dialog,
  DialogPosition,
  Typography,
  imageResize,
  IMAGE_WIDTH,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import * as styles from './photo-prompt.styles';
import { PhotoPromptActionType } from './photo-prompt.types';

import womanEmoji from '@/assets/emojis/womanEmoji.png';
import manEmoji from '@/assets/emojis/manEmoji.png';
import duckEmoji from '@/assets/emojis/avatar_duck.png';
import catEmoji from '@/assets/emojis/avatar_cat.png';
import leopardEmoji from '@/assets/emojis/avatar_leopard.png';
import dogEmoji from '@/assets/emojis/avatar_dog.png';
import penguinEmoji from '@/assets/emojis/penguinEmoji.png';
import monkeyEmoji from '@/assets/emojis/avatar_monkey.png';

import profile1 from '@/assets/profile-emojis/animoji-1.svg';
import profile2 from '@/assets/profile-emojis/animoji-2.svg';
import profile3 from '@/assets/profile-emojis/animoji-3.svg';
import profile4 from '@/assets/profile-emojis/animoji-4.svg';
import profile5 from '@/assets/profile-emojis/animoji-5.svg';
import profile6 from '@/assets/profile-emojis/animoji-6.svg';
import profile7 from '@/assets/profile-emojis/animoji-7.svg';
import profile8 from '@/assets/profile-emojis/animoji-8.svg';
import profile9 from '@/assets/profile-emojis/animoji-9.svg';
import profile10 from '@/assets/profile-emojis/animoji-10.svg';
import profile11 from '@/assets/profile-emojis/animoji-11.svg';
import profile12 from '@/assets/profile-emojis/animoji-12.svg';
import profile13 from '@/assets/profile-emojis/animoji-13.svg';
import profile14 from '@/assets/profile-emojis/animoji-14.svg';
import profile15 from '@/assets/profile-emojis/animoji-15.svg';
import profile16 from '@/assets/profile-emojis/animoji-16.svg';
import profile17 from '@/assets/profile-emojis/animoji-17.svg';
import profile18 from '@/assets/profile-emojis/animoji-18.svg';
import profile19 from '@/assets/profile-emojis/animoji-19.svg';
import profile20 from '@/assets/profile-emojis/animoji-20.svg';
import profile21 from '@/assets/profile-emojis/animoji-21.svg';
import profile22 from '@/assets/profile-emojis/animoji-22.svg';
import profile23 from '@/assets/profile-emojis/animoji-23.svg';
import profile24 from '@/assets/profile-emojis/animoji-24.svg';
import profile25 from '@/assets/profile-emojis/animoji-25.svg';
import profile26 from '@/assets/profile-emojis/animoji-26.svg';
import profile27 from '@/assets/profile-emojis/animoji-27.svg';
import profile28 from '@/assets/profile-emojis/animoji-28.svg';
import profile29 from '@/assets/profile-emojis/animoji-29.svg';
import profile30 from '@/assets/profile-emojis/animoji-30.svg';
import profile31 from '@/assets/profile-emojis/animoji-31.svg';
import profile32 from '@/assets/profile-emojis/animoji-32.svg';
import profile33 from '@/assets/profile-emojis/animoji-33.svg';
import profile34 from '@/assets/profile-emojis/animoji-34.svg';
import profile35 from '@/assets/profile-emojis/animoji-35.svg';
import profile36 from '@/assets/profile-emojis/animoji-36.svg';
import profile37 from '@/assets/profile-emojis/animoji-37.svg';
import profile38 from '@/assets/profile-emojis/animoji.svg';
import { XIcon } from '@heroicons/react/solid';

export interface PhotoPromptProps extends ComponentBaseProps {
  title: string;
  onClose?: () => void;
  onAction?: (imageBaseString: string) => void;
  onDelete?: () => void;
  isProfileEmojis?: boolean;
  isLoading?: boolean;
  showEmojiOption?: boolean;
  resolutionLimit?: number;
}

/**
 * Refactor proposal: Pass action list as subcomponent instead. This will remove the need to call the get actions method in the useEffect. HG
 *
 */

export const PhotoPrompt: React.FC<PhotoPromptProps> = ({
  title,
  onClose,
  onAction,
  onDelete,
  showEmojiOption,
  isProfileEmojis,
  isLoading,
  resolutionLimit,
}) => {
  const [actions, setActions] = useState<
    ActionSelectItem<PhotoPromptActionType>[]
  >([]);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [emojisSection, setEmojisSection] = useState(false);
  const emojis = [
    womanEmoji,
    manEmoji,
    duckEmoji,
    catEmoji,
    leopardEmoji,
    dogEmoji,
    penguinEmoji,
    monkeyEmoji,
  ];

  const profileEmojis = [
    profile1,
    profile2,
    profile3,
    profile4,
    profile5,
    profile6,
    profile7,
    profile8,
    profile9,
    profile10,
    profile11,
    profile12,
    profile13,
    profile14,
    profile15,
    profile16,
    profile17,
    profile18,
    profile19,
    profile20,
    profile21,
    profile22,
    profile23,
    profile24,
    profile25,
    profile26,
    profile27,
    profile28,
    profile29,
    profile30,
    profile31,
    profile32,
    profile33,
    profile34,
    profile35,
    profile36,
    profile37,
    profile38,
  ];

  const getActions = useCallback(() => {
    const actionsList: ActionSelectItem<PhotoPromptActionType>[] = [];

    if (onDelete) {
      actionsList.push({
        icon: renderIcon('TrashIcon', styles.iconStyle),
        title: 'Delete',
        value: 'delete',
        actionColour: 'errorMain',
      });
    }

    actionsList.push({
      icon: renderIcon('PhotographIcon', styles.iconStyle),
      title: 'Gallery',
      value: 'gallery',
      actionColour: 'secondary',
    });

    actionsList.push({
      icon: renderIcon('CameraIcon', styles.iconStyle),
      title: 'Camera',
      value: 'camera',
      actionColour: 'secondary',
    });

    if (!!showEmojiOption) {
      actionsList.push({
        icon: renderIcon('EmojiHappyIcon', styles.iconStyle),
        title: 'Emojis',
        value: 'emojis',
        actionColour: 'secondary',
      });
    }

    setActions(actionsList);
  }, [onDelete]);

  const openCamera = async () => {
    setIsOpenCamera(true);
  };

  const openGallery = () => {
    getImageSourceFromFileSystem(undefined, resolutionLimit).then((dataUrl) => {
      if (dataUrl && onAction) {
        onAction(dataUrl);
      }
    });
  };

  const deletePhoto = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const close = () => {
    if (onClose) {
      onClose();
    }
  };

  const onGetPhoto = (photo: string) => {
    if (onAction) {
      onAction(photo);
    }
  };

  const actionSelected = (value: PhotoPromptActionType) => {
    switch (value) {
      case 'camera':
        openCamera();
        break;
      case 'delete':
        deletePhoto();
        break;
      case 'gallery':
        openGallery();
        break;
      case 'emojis':
        setEmojisSection(true);
        break;
      default:
        close();
        break;
    }
  };

  useEffect(() => {
    getActions();
  }, [getActions]);

  return (
    <>
      <ActionSelect
        isLoading={isLoading}
        actions={actions}
        title={title}
        onActionSelected={actionSelected}
        onClose={close}
      />

      {isOpenCamera && (
        <Camera
          onGetPhoto={onGetPhoto}
          onClose={close}
          resolutionLimit={resolutionLimit}
        />
      )}

      <Dialog
        visible={emojisSection}
        position={DialogPosition.Middle}
        fullScreen
        className="overflow-auto"
      >
        <div className="flex items-center justify-between">
          <Typography
            type={'h1'}
            weight="bold"
            color={'textMid'}
            className="ml-6 mt-6"
            text={'Choose your emoji'}
          />
          <XIcon
            className="text-textMid mt-6 mr-2 h-8 w-8"
            onClick={() => setEmojisSection(false)}
          />
        </div>

        <div className="flex h-full flex-wrap justify-center overflow-auto">
          <div className="mt-16 grid h-screen w-9/12 grid-cols-2 justify-center gap-x-8 gap-y-8 overflow-auto">
            {isProfileEmojis
              ? !!profileEmojis?.length &&
                profileEmojis.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center justify-center"
                  >
                    <img
                      src={item}
                      alt="emojis"
                      onClick={async () => {
                        onAction && onAction(item);
                      }}
                    />
                  </div>
                ))
              : !!emojis?.length &&
                emojis.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center justify-center"
                  >
                    <img
                      src={item}
                      alt="emojis"
                      onClick={() => onAction && onAction(item)}
                    />
                  </div>
                ))}
          </div>
          <div className="mt-14 mb-20 flex w-full justify-center">
            <div className="flex w-full justify-center ">
              <Button
                type={'filled'}
                text={'Close'}
                color={'quatenary'}
                textColor={'white'}
                className={'w-11/12'}
                iconPosition={'start'}
                onClick={() => setEmojisSection(false)}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};
