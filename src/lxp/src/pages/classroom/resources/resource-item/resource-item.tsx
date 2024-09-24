import LanguageSelector from '@/components/language-selector/language-selector';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Alert,
  BannerWrapper,
  Button,
  CheckboxGroup,
  Divider,
  Radio,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { ResourcesService } from '@/services/ResourcesService';
import { ThumbUpIcon } from '@heroicons/react/solid';
import { ResourcesNames } from '../resources.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { ContentTypeEnum } from '@ecdlink/core';

interface ResourceItemProps {
  resource: any;
  onClose: () => void;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  resource,
  onClose,
}) => {
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);

  const [isLiked, setIsLiked] = useState(false);
  console.log({ isLiked });

  const handleCheckIfUserLiked = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.getResourceLikedStatusForUser(resource?.id);
    console.log({ response });
    if (response) {
      setIsLiked(response?.isActive);
    }
  }, [resource?.id, userAuth?.auth_token]);

  useEffect(() => {
    handleCheckIfUserLiked();
  }, []);

  const handleUpdateResourceLike = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.updateResourceLikes(
      resource?.id,
      ContentTypeEnum?.ClassroomBusinessResource,
      isLiked
    );
    console.log({ response });
    // if (response) {
    //   setResources(response);
    // }
  }, [isLiked, resource?.id, userAuth?.auth_token]);

  // useEffect(() => {
  //   if (isLiked) {
  //     handleUpdateResourceLike();
  //   }
  // }, [handleUpdateResourceLike, isLiked]);

  const getChipStatusColor = (resourceType: string) => {
    switch (resourceType) {
      case ResourcesNames.activities:
        return 'quatenaryBg';
      case ResourcesNames.stories:
        return 'secondaryAccent1';
      case ResourcesNames.teachingTips:
        return 'warningBg';
      default:
        return 'successMain';
    }
  };

  const renderResourceDataType = useMemo(() => {
    if (resource?.dataFree === 'true' || resource?.dataFree === true) {
      return (
        <Alert
          className="mt-2 mb-4 rounded-md"
          title={`This resource is data free!`}
          type="success"
          titleType="h4"
        />
      );
    } else {
      return (
        <Alert
          className="mt-2 mb-4 rounded-md"
          title={`This resource is not data free. Going to this link will use your data.`}
          type="warning"
          titleType="h4"
        />
      );
    }
  }, [resource?.dataFree]);

  const handleShare = useCallback(async () => {
    if (navigator?.share) {
      try {
        await navigator?.share({
          title: 'Share resource',
          url: resource?.link,
        });
        console.log('Content shared successfully');
      } catch (error) {
        console.error('Error sharing the content:', error);
      }
    } else {
      alert('Web Share API not supported in this browser.');
    }
  }, [resource?.link]);

  return (
    <div>
      <BannerWrapper
        size="small"
        onBack={() => onClose()}
        color="primary"
        className={'h-full'}
        title={resource?.title}
        displayOffline={!isOnline}
        onClose={() => onClose()}
      />
      <LanguageSelector
        labelText="Change language:"
        labelClassName="font-medium font-body text-textDark pr-2"
        currentLocale="en-za"
        selectLanguage={(data) => {}}
      />
      <div className="p-4">
        <Typography type="h2" text={resource?.title} color="textDark" />
        <div className="my-2 flex items-center gap-4">
          <StatusChip
            backgroundColour={getChipStatusColor(resource?.resourceType)}
            borderColour={getChipStatusColor(resource?.resourceType)}
            textColour={'textDark'}
            textType={'body'}
            text={resource?.resourceType}
            className="w-max py-2"
          />
          <div
            className={`${
              Number(resource?.numberLikes) > 0
                ? 'bg-successMain'
                : 'bg-infoMain'
            }  full mr-4 flex items-center gap-2 rounded-full px-3 py-0.5`}
          >
            <ThumbUpIcon className="h-5 w-5 text-white" />
            <div>{resource?.numberLikes ? resource?.numberLikes : 0}</div>
          </div>
        </div>
        <Typography
          type="help"
          text={resource?.shortDescription}
          color="textMid"
          className="my-4"
        />
        <div>{renderResourceDataType}</div>
        <Button
          onClick={() => window.open(resource?.link, '_blank')}
          className="mt-2 w-full rounded-2xl"
          size="normal"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={'LinkIcon'}
          text={'See resource'}
        />
        <Typography
          type="help"
          text={resource?.longDescription}
          color="textMid"
          className="my-4"
        />
        <Divider dividerType="dashed" className="my-4" />
        <div className="my-4">
          <Typography
            type="h2"
            text={'Was this link helpful?'}
            color="textDark"
          />
          <Typography
            type="body"
            text={'You can like it to let other ECD Heroes know.'}
            color="textMid"
          />
        </div>
        <CheckboxGroup
          className="bg-quatenaryBg mb-2"
          checkboxColor="quatenary"
          id={'1'}
          key={'1'}
          title={'Like this resource'}
          titleWeight="normal"
          checked={isLiked}
          onChange={(e) => {
            setIsLiked(e?.checked);
            handleUpdateResourceLike();
          }}
        />
        <Divider dividerType="dashed" className="my-4" />
        <Button
          onClick={handleShare}
          className="mt-2 w-full rounded-2xl"
          size="normal"
          color="quatenary"
          textColor="white"
          type="filled"
          icon={'PaperAirplaneIcon'}
          text={'Share resource'}
        />
      </div>
    </div>
  );
};
