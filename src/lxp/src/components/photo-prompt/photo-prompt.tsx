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

export interface PhotoPromptProps extends ComponentBaseProps {
  title: string;
  onClose?: () => void;
  onAction?: (imageBaseString: string) => void;
  onDelete?: () => void;
  hideEmojiOption?: boolean;
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
  hideEmojiOption,
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

    if (!hideEmojiOption) {
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
    getImageSourceFromFileSystem().then((dataUrl) => {
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
        actions={actions}
        title={title}
        onActionSelected={actionSelected}
        onClose={close}
      />

      {isOpenCamera && <Camera onGetPhoto={onGetPhoto} onClose={close} />}

      <Dialog
        visible={emojisSection}
        position={DialogPosition.Middle}
        fullScreen
        className="overflow-auto"
      >
        <Typography
          type={'h1'}
          weight="bold"
          color={'textMid'}
          className="ml-6 mt-6"
          text={'Choose your emoji'}
        />

        <div className="flex flex-wrap justify-center">
          <div className="mt-16 grid w-9/12 grid-cols-2 justify-center gap-x-8 gap-y-8 overflow-auto">
            {!!emojis?.length &&
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
          <div className="mt-14 flex w-full justify-center">
            <div className="flex w-full justify-center ">
              <Button
                type={'filled'}
                text={'Confirm'}
                color={'primary'}
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
