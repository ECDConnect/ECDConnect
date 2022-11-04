import { ActionSelect } from '@ecdlink/ui';
import {
  ActionSelectItem,
  ComponentBaseProps,
  Dialog,
  DialogPosition,
  Typography,
  Button,
} from '@ecdlink/ui';
import {
  getImageSourceFromCamera,
  getImageSourceFromFileSystem,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import * as styles from './photo-prompt.styles';
import { PhotoPromptActionType } from './photo-prompt.types';
import womanEmoji from '../../assets/emojis/womanEmoji.png';
import manEmoji from '../../assets/emojis/manEmoji.png';
import duckEmoji from '../../assets/emojis/avatar_duck.png';
import catEmoji from '../../assets/emojis/avatar_cat.png';
import leopardEmoji from '../../assets/emojis/avatar_leopard.png';
import dogEmoji from '../../assets/emojis/avatar_dog.png';
import penguinEmoji from '../../assets/emojis/penguinEmoji.png';
import monkeyEmoji from '../../assets/emojis/avatar_monkey.png';

export interface PhotoPromptProps extends ComponentBaseProps {
  title: string;
  onClose?: () => void;
  onAction?: (imageBaseString: string) => void;
  onDelete?: () => void;
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
}) => {
  const [actions, setActions] = useState<
    ActionSelectItem<PhotoPromptActionType>[]
  >([]);
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

  useEffect(() => {
    getActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getActions = () => {
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
    });

    actionsList.push({
      icon: renderIcon('CameraIcon', styles.iconStyle),
      title: 'Camera',
      value: 'camera',
    });
    actionsList.push({
      icon: renderIcon('EmojiHappyIcon', styles.iconStyle),
      title: 'Emojis',
      value: 'emojis',
    });

    setActions(actionsList);
  };

  const openCamera = async () => {
    const imageBaseString = await getImageSourceFromCamera();
    if (imageBaseString && onAction) {
      onAction(imageBaseString);
    }
  };

  const openGallery = () => {
    getImageSourceFromFileSystem()
      .then((dataUrl) => {
        if (dataUrl && onAction) {
          onAction(dataUrl);
        }
      })
      .catch((error: unknown) => console.error(error));
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

  return (
    <>
      <ActionSelect
        actions={actions}
        title={title}
        onActionSelected={actionSelected}
        onClose={close}
      />
      <Dialog
        visible={emojisSection}
        position={DialogPosition.Middle}
        fullScreen
        className="overflow-auto"
      >
        <div>
          <Typography
            className="ml-6 mt-6"
            weight="bold"
            type={'h1'}
            color={'textMid'}
            text={'Choose your emoji'}
          ></Typography>
        </div>
        <div className="flex flex-wrap justify-center">
          <div className="mt-16 grid w-9/12 grid-cols-2 justify-center gap-x-8 gap-y-8 overflow-auto">
            {emojis.map((item, index) => {
              return (
                <div
                  key={`${item}-${index}`}
                  className="flex items-center justify-center"
                >
                  <img src={item} alt="emojis" />;
                </div>
              );
            })}
          </div>
          <div className="mt-14 flex w-full justify-center">
            <div className="flex w-full justify-center ">
              <Button
                className={'w-11/12'}
                type={'filled'}
                color={'primary'}
                text={'Confirm'}
                textColor={'white'}
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
