import LanguageSelector from '@/components/language-selector/language-selector';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Alert,
  BannerWrapper,
  Button,
  CheckboxGroup,
  Divider,
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
import { staticDataSelectors } from '@/store/static-data';
import { LanguageCode } from '@/i18n/types';

interface ResourceItemProps {
  resource: any;
  onClose: () => void;
  handleGetResourcesQueries: any;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  resource,
  onClose,
  handleGetResourcesQueries,
}) => {
  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [locale, setLocale] = useState<string>(
    '9688cd08-adef-408c-9d34-5d75ae5c44df'
  );
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [isLiked, setIsLiked] = useState(false);
  const [resourceItem, setResourceItem] = useState(resource);

  const resourceLanguages = languages.filter((item) =>
    resourceItem['availableLanguages'].map((x: any) => x).includes(item.id)
  );

  const availableLanguages: LanguageCode[] = resourceLanguages
    ? resourceLanguages?.map((item) => {
        return item?.locale as LanguageCode;
      })
    : [language?.locale as LanguageCode];

  const handleCheckIfUserLiked = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.getResourceLikedStatusForUser(resource?.id);

    if (response) {
      setIsLiked(response?.isActive);
    }
  }, [resource?.id, userAuth?.auth_token]);

  useEffect(() => {
    handleCheckIfUserLiked();
  }, []);

  const handleUpdateResourceLike = useCallback(
    async (isLikedByUser) => {
      const response = await new ResourcesService(
        userAuth?.auth_token!
      )?.updateResourceLikes(
        resource?.id,
        ContentTypeEnum?.ClassroomBusinessResource,
        isLikedByUser
      );

      if (response) {
        handleGetResourcesQueries();
      }
    },
    [handleGetResourcesQueries, resource?.id, userAuth?.auth_token]
  );

  const handleGetResourceByLanguage = useCallback(async () => {
    const response = await new ResourcesService(
      userAuth?.auth_token!
    )?.resourceByLanguage(
      resource?.id,
      ContentTypeEnum?.ClassroomBusinessResource,
      locale
    );

    if (response) {
      setResourceItem(response);
    }
  }, [locale, resource?.id, userAuth?.auth_token]);

  useEffect(() => {
    if (locale) {
      handleGetResourceByLanguage();
    }
  }, [handleGetResourceByLanguage, locale]);

  const getChipStatusColor = (resourceType: string) => {
    switch (resourceType) {
      case ResourcesNames.financial:
        return 'quatenaryBg';
      case ResourcesNames.administration:
        return 'secondaryAccent1';
      case ResourcesNames.dbe:
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
        onBack={() => {
          onClose();
          handleGetResourcesQueries();
        }}
        color="primary"
        className={'h-full'}
        title={resourceItem?.title}
        displayOffline={!isOnline}
        onClose={() => {
          onClose();
          handleGetResourcesQueries();
        }}
      />
      <LanguageSelector
        labelText="Change language:"
        labelClassName="font-medium font-body text-textDark pr-2"
        currentLocale="en-za"
        availableLanguages={availableLanguages}
        selectLanguage={(data) => {
          setLocale(data?.id!);
        }}
      />
      <div className="p-4">
        <Typography type="h2" text={resourceItem?.title} color="textDark" />
        <div className="my-2 flex items-center gap-4">
          <StatusChip
            backgroundColour={getChipStatusColor(resourceItem?.resourceType)}
            borderColour={getChipStatusColor(resourceItem?.resourceType)}
            textColour={'textDark'}
            textType={'body'}
            text={resourceItem?.resourceType}
            className="w-max py-2"
          />
          <div
            className={`${
              Number(resourceItem?.numberLikes) > 0
                ? 'bg-successMain'
                : 'bg-infoMain'
            }  full mr-4 flex items-center gap-2 rounded-full px-3 py-0.5 text-white`}
          >
            <ThumbUpIcon className="h-5 w-5 text-white" />
            <div>
              {resourceItem?.numberLikes ? resourceItem?.numberLikes : 0}
            </div>
          </div>
        </div>
        <Typography
          type="help"
          text={resourceItem?.shortDescription}
          color="textMid"
          className="my-4"
        />
        <div>{renderResourceDataType}</div>
        <Button
          onClick={() => window.open(resourceItem?.link, '_blank')}
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
          text={resourceItem?.longDescription?.replace(
            /<\/?[a-z][a-z0-9]*[^<>]*>/gi,
            ''
          )}
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
            handleUpdateResourceLike(e?.checked);
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
