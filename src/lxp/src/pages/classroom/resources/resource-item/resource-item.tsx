import LanguageSelector from '@/components/language-selector/language-selector';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  Alert,
  BannerWrapper,
  Button,
  CheckboxGroup,
  Divider,
  LoadingSpinner,
  StatusChip,
  Typography,
} from '@ecdlink/ui';
import { ThumbUpIcon } from '@heroicons/react/solid';
import { ResourcesNames } from '../resources.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentTypeEnum, ResourceLocaleId } from '@ecdlink/core';
import { staticDataSelectors } from '@/store/static-data';
import { LanguageCode } from '@/i18n/types';
import { useAppDispatch } from '@/store';
import { resourcesThunkActions } from '@/store/resources';

interface ResourceItemProps {
  resourceId: number;
  onClose: () => void;
  handleGetResourcesQueries: any;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  resourceId,
  onClose,
  handleGetResourcesQueries,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [locale, setLocale] = useState<string>(ResourceLocaleId);
  const [language] = useState({ locale: 'en-za' });
  const languages = useSelector(staticDataSelectors.getLanguages);
  const [isLiked, setIsLiked] = useState(false);
  const [resourceItem, setResourceItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetResourceByLanguage = useCallback(async () => {
    try {
      const response = await appDispatch(
        resourcesThunkActions.getResourceByLanguage({
          contentId: resourceId,
          contentTypeId: ContentTypeEnum?.ClassroomBusinessResource,
          localeId: locale,
          sectionType: 'business',
        })
      ).unwrap();
      setResourceItem(response);
    } catch (error) {
      console.error('Failed to fetch getResourceByLanguage:', error);
    }
  }, [appDispatch, locale, resourceId]);

  useEffect(() => {
    if (locale) {
      handleGetResourceByLanguage();
    }
  }, [handleGetResourceByLanguage, locale]);

  const resourceLanguages = languages?.filter((item) => {
    const availableLangs = resourceItem?.['availableLanguages'] ?? [];
    return availableLangs.some((lang: any) => lang.id === item.id);
  });

  const availableLanguages: LanguageCode[] = resourceLanguages?.length
    ? resourceLanguages.map((item) => item?.locale as LanguageCode)
    : [language?.locale as LanguageCode];

  const handleCheckIfUserLiked = useCallback(async () => {
    if (!resourceId) return;

    try {
      const response = await appDispatch(
        resourcesThunkActions.getResourceLikedStatusForUser({
          contentId: resourceId,
        })
      ).unwrap();

      setIsLiked(!!response);
    } catch (error) {
      console.error('Failed to fetch getResourceLikedStatusForUser:', error);
    }
  }, [appDispatch, resourceId]);

  useEffect(() => {
    handleCheckIfUserLiked();
  }, [handleCheckIfUserLiked]);

  const handleUpdateResourceLike = useCallback(
    async (isLikedByUser: boolean) => {
      try {
        setIsLoading(true);
        await appDispatch(
          resourcesThunkActions.updateResourceLikes({
            contentId: resourceId,
            contentTypeId: ContentTypeEnum?.ClassroomBusinessResource,
            liked: isLikedByUser,
          })
        ).unwrap();

        await appDispatch(
          resourcesThunkActions.getResourceByLanguage({
            contentId: resourceId,
            localeId: ResourceLocaleId,
            contentTypeId: ContentTypeEnum?.ClassroomBusinessResource,
            overrideCache: true,
            sectionType: 'business',
          })
        ).unwrap();

        // Refresh the like count shown in this item
        await handleGetResourceByLanguage();

        handleGetResourcesQueries();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to updateResourceLikes:', error);
      }
    },
    [
      appDispatch,
      resourceId,
      handleGetResourceByLanguage,
      handleGetResourcesQueries,
      setIsLoading,
    ]
  );

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
    if (resourceItem?.dataFree === 'true' || resourceItem?.dataFree === true) {
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
  }, [resourceItem?.dataFree]);

  const handleShare = useCallback(async () => {
    if (navigator?.share) {
      try {
        await navigator?.share({
          title: 'Share resource',
          url: resourceItem?.link,
        });
      } catch (error) {
        console.error('Error sharing the content:', error);
      }
    } else {
      alert('Web Share API not supported in this browser.');
    }
  }, [resourceItem?.link]);

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
      <div className="bg-white p-4">
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
            } full mr-4 flex items-center gap-2 rounded-full px-3 py-0.5 text-white`}
          >
            <ThumbUpIcon className="h-5 w-5 text-white" />
            <div>
              {resourceItem?.numberLikes
                ? resourceItem?.numberLikes + ' likes'
                : '0 likes'}
            </div>
          </div>
          {isLoading && (
            <LoadingSpinner
              size={'medium'}
              spinnerColor={'quatenary'}
              backgroundColor={'uiBg'}
            />
          )}
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
          type="markdown"
          text={resourceItem?.longDescription}
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
          textColor="quatenary"
          type="outlined"
          icon={'PaperAirplaneIcon'}
          text={'Share resource'}
        />
      </div>
    </div>
  );
};
