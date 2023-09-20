import {
  getImageSourceFromFileSystem,
  renderIcon,
  ActionSelect,
  ActionSelectItem,
  ComponentBaseProps,
  Camera,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import * as styles from './photo-prompt.styles';
import { PhotoPromptActionType } from './photo-prompt.types';

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
  const [isOpenCamera, setIsOpenCamera] = useState(false);

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
    });

    actionsList.push({
      icon: renderIcon('CameraIcon', styles.iconStyle),
      title: 'Camera',
      value: 'camera',
    });

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
    </>
  );
};
