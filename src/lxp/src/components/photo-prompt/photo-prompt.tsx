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

import { XIcon } from '@heroicons/react/solid';

// Total number of profile emojis available
const PROFILE_EMOJI_COUNT = 38;

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
  const [profileEmojis, setProfileEmojis] = useState<string[]>([]);
  const [profileEmojisLoading, setProfileEmojisLoading] = useState(false);

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

  const loadProfileEmojis = useCallback(async () => {
    if (profileEmojis.length > 0) return; // already loaded

    setProfileEmojisLoading(true);
    try {
      const indices = Array.from(
        { length: PROFILE_EMOJI_COUNT },
        (_, i) => (i < PROFILE_EMOJI_COUNT - 1 ? `${i + 1}` : '') // last file is animoji.svg (no number)
      );

      const loaded = await Promise.all(
        indices.map((n) => {
          const fileName = n ? `animoji-${n}` : 'animoji';
          return import(`@/assets/profile-emojis/${fileName}.svg`).then(
            (mod) => mod.default as string
          );
        })
      );

      setProfileEmojis(loaded);
    } finally {
      setProfileEmojisLoading(false);
    }
  }, [profileEmojis.length]);

  const openEmojis = useCallback(async () => {
    setEmojisSection(true);
    if (isProfileEmojis) {
      await loadProfileEmojis();
    }
  }, [isProfileEmojis, loadProfileEmojis]);

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
        openEmojis();
        break;
      default:
        close();
        break;
    }
  };

  useEffect(() => {
    getActions();
  }, [getActions]);

  const activeEmojis = isProfileEmojis ? profileEmojis : emojis;

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
            {profileEmojisLoading ? (
              <div className="col-span-2 flex items-center justify-center py-16">
                <span className="text-textMid text-sm">Loading emojis…</span>
              </div>
            ) : (
              activeEmojis.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center justify-center"
                >
                  <img
                    src={item}
                    alt="emoji"
                    onClick={() => onAction && onAction(item)}
                  />
                </div>
              ))
            )}
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
