import {
  ActivityDto,
  getAvatarColor,
  StoryBookDto,
  LanguageDto,
  useSessionStorage,
} from '@ecdlink/core/';
import {
  Alert,
  BannerWrapper,
  Button,
  Divider,
  RoundIcon,
  StatusChip,
  Typography,
  URL,
  stripPTag,
} from '@ecdlink/ui/';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LanguageSelector from '../../../../../../../components/language-selector/language-selector';
import { StoryBookTypes } from '@enums/ProgrammeRoutineType';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { activitySelectors } from '@store/content/activity';
import { storyBookSelectors } from '@store/content/story-book';
import { getLogo, LogoSvgs } from '@utils/common/svg.utils';
import StoryActivityCard from '../story-activity-card/story-activity-card';
import StoryCard from '../story-card/story-card';
import { StoryActivityDetailsProps } from './story-activity-details.types';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { staticDataSelectors } from '@/store/static-data';
import { ContentStoryBookService } from '@/services/ContentStoryBookService';
import { authSelectors } from '@store/auth';
import { ContentActivityService } from '@/services/ContentActivityService';
import { LanguageCode } from '@/i18n/types';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { practitionerSelectors } from '@/store/practitioner';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';

const StoryActivityDetails: React.FC<StoryActivityDetailsProps> = ({
  storyBookId,
  activityId: activityIdFromProp,
  viewType,
  disabled,
  onStoryBookSelected,
  onStoryBookSwitched,
  onActivitySelected,
  onActivitySwitched,
  onBack,
  selected,
}) => {
  const [activityIdFromSessionStorage, setSessionActivityId] =
    useSessionStorage('storyActivityDetailsActivityId');

  const activityId = activityIdFromProp || Number(activityIdFromSessionStorage);

  const { isOnline } = useOnlineStatus();
  const activityDetail = useSelector(
    activitySelectors.getActivityById(activityId)
  );
  const storyBook = useSelector(
    storyBookSelectors.getStoryBookById(storyBookId)
  );
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const title =
    viewType === 'StoryBook' ? storyBook?.name : activityDetail?.name;
  const subTitle = viewType === 'StoryBook' ? 'Story' : 'Story Activity';

  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();
  const isTrialPeriod = useIsTrialPeriod();

  const hasPermissionToEdit =
    practitioner?.isPrincipal ||
    hasPermissionToPlanClassroomActivities ||
    isTrialPeriod;

  useEffect(() => {
    if (activityIdFromProp) {
      setSessionActivityId(String(activityIdFromProp));
    }
  }, [activityIdFromProp, setSessionActivityId]);

  if (viewType === 'StoryBook' && !storyBook) return <></>;
  if (viewType === 'StoryActivity' && !activityDetail) return <></>;

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={title}
      subTitle={subTitle}
      color={'primary'}
      backgroundColour="white"
      onBack={() => {
        setSessionActivityId(undefined);
        onBack();
      }}
      displayOffline={!isOnline}
    >
      {viewType === 'StoryBook' ? (
        <StoryBookDetails
          disabled={disabled || !hasPermissionToEdit}
          storyBook={storyBook as StoryBookDto}
          onStorySelected={() => {
            setSessionActivityId(undefined);
            onStoryBookSelected?.();
          }}
          onStorySwitched={() => {
            setSessionActivityId(undefined);
            onStoryBookSelected?.();
          }}
          onActivitySwitched={onActivitySwitched}
          isSelected={selected}
          linkedActivity={activityDetail}
        />
      ) : (
        <StorybookActivityDetails
          disabled={disabled || !hasPermissionToEdit}
          activity={activityDetail as ActivityDto}
          onActivitySelected={onActivitySelected}
          onActivitySwitched={onActivitySwitched}
          onStorySwitched={onStoryBookSwitched}
          isSelected={selected}
          linkedStory={storyBook}
        />
      )}
    </BannerWrapper>
  );
};

type StoryBookDetailsProps = {
  storyBook: StoryBookDto;
  linkedActivity?: ActivityDto;
  disabled?: boolean;
  onStorySelected?: () => void;
  onStorySwitched?: () => void;
  onActivitySwitched?: () => void;
  isSelected?: boolean;
};

const StoryBookDetails: React.FC<StoryBookDetailsProps> = ({
  storyBook,
  onStorySelected,
  onStorySwitched,
  disabled,
  onActivitySwitched,
  isSelected,
  linkedActivity,
}) => {
  const [isOnlineOnlyAlert, setOnlineOnlyAlert] = useState(false);
  const [currentStoryBook, setCurrentStoryBook] = useState(storyBook);
  const [currentStoryBookParts, setCurrentStoryBookParts] = useState(
    [...(storyBook?.storyBookParts || [])].sort((a, b) =>
      +a.part >= +b.part ? 1 : -1
    )
  );
  const { isOnline } = useOnlineStatus();
  const authUser = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const defaultLanguage = languages?.find(
    (item: LanguageDto) => item?.locale === 'en-za'
  );

  const availableLanguages: LanguageCode[] = storyBook?.availableLanguages
    ?.length
    ? storyBook.availableLanguages?.map((item) => {
        return item?.locale as LanguageCode;
      })
    : [defaultLanguage?.locale as LanguageCode];

  const onBookLocationClicked = (bookLocation: string) => {
    const _strippedHtml = stripPTag(bookLocation);
    if (_strippedHtml.match(URL)) {
      window.open(_strippedHtml, '_blank');
    }
  };

  const getDataByLanguage = async (language: LanguageDto) => {
    const hasTranslations = storyBook?.availableLanguages?.some(
      (item) => item.id === language.id
    );

    if (hasTranslations) {
      let storyBooks: StoryBookDto[] | undefined;

      storyBooks = await new ContentStoryBookService(
        authUser?.auth_token || ''
      ).getStoryBooks(language.locale);

      const translatedBook = storyBooks?.find(
        (item) => item.id === currentStoryBook.id
      );
      setCurrentStoryBook(translatedBook || storyBook);
      if (translatedBook?.storyBookParts) {
        setCurrentStoryBookParts(
          [...(translatedBook?.storyBookParts || [])].sort((a, b) =>
            +a.part >= +b.part ? 1 : -1
          )
        );
      }
    }
  };

  return (
    <div className={'flex flex-col bg-white'}>
      <div className={'flex flex-col items-start justify-start'}>
        <div className="bg-uiBg w-full">
          <LanguageSelector
            labelClassName="text-textDark mr-2"
            currentLocale={'en-za'}
            availableLanguages={availableLanguages}
            selectLanguage={getDataByLanguage}
          />
        </div>

        {isOnlineOnlyAlert && (
          <div className="absolute  z-10 flex h-full items-center ">
            <div className="rounded-10 z-10 mx-4 bg-white opacity-100">
              <OnlineOnlyModal
                onSubmit={() => setOnlineOnlyAlert(false)}
              ></OnlineOnlyModal>
            </div>
            <div className="absolute z-0 h-full w-full bg-gray-600 opacity-40"></div>
          </div>
        )}
        <div className={'items-stetch flex w-full flex-col justify-start p-4'}>
          <div
            className={
              'align-center flex flex-row items-center justify-between'
            }
          >
            <Typography
              text={currentStoryBook.name}
              type={'h1'}
              color={'textDark'}
            />
            <StatusChip
              backgroundColour={'quatenary'}
              borderColour={'quatenary'}
              textColour={'primary'}
              textType={'body'}
              text={currentStoryBook.type}
            />
          </div>
          {!disabled &&
            (isSelected ? (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-6 w-full'}
                textColor={'white'}
                text={`Change story & activity`}
                icon={'RefreshIcon'}
                iconPosition={'start'}
                onClick={onStorySwitched}
              />
            ) : (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-6 w-full'}
                textColor={'white'}
                text={'Choose this story'}
                icon={'CheckCircleIcon'}
                iconPosition={'start'}
                onClick={onStorySelected}
              />
            ))}
          <Divider dividerType="dashed" className={'mt-4 mb-2'} />
          {linkedActivity && (
            <>
              <Typography type={'h3'} text={'Story activity chosen'} />
              <StoryActivityCard
                hideRadio
                title={linkedActivity.name}
                activityId={linkedActivity.id}
                material={linkedActivity.materials}
                hideDetails={true}
                selected={false}
                buttonIcon={'SwitchVerticalIcon'}
                buttonText={'Change activity'}
                onSelected={() =>
                  onActivitySwitched && isOnline
                    ? onActivitySwitched()
                    : setOnlineOnlyAlert(true)
                }
                onCleared={() => {}}
              />
            </>
          )}
        </div>

        {currentStoryBook?.type !== StoryBookTypes.other && (
          <div className={'bg-white px-4'}>
            {currentStoryBook?.type === StoryBookTypes.storyBook && (
              <>
                <Typography
                  text={'Where can you find a copy of this story book'}
                  type={'h4'}
                  color="textDark"
                />
                <ul className={'text-textMid ml-4 mt-4 list-disc'}>
                  <li>
                    <Typography
                      text={currentStoryBook.bookLocation}
                      type={'body'}
                      color="textMid"
                      onClick={() => {
                        onBookLocationClicked(currentStoryBook.bookLocation);
                      }}
                    />
                  </li>
                </ul>
                <Divider dividerType="dashed" className="my-4" />
                {currentStoryBook.author && (
                  <Typography
                    text={`<b class='text-textDark'>Author: </b><span class='text-textMid'>${currentStoryBook.author}</span>`}
                    type={'markdown'}
                    color="textDark"
                  />
                )}
                {/* TODO: add translator (w38) */}
                {/* {currentStoryBook.author && (
                  <Typography
                    text={`<b class='text-textDark'>Author: </b><span class='text-textMid'>${currentStoryBook.author}</span>`}
                    type={'markdown'}
                    color='textDark'
                  />
                )} */}
                {currentStoryBook.illustrator && (
                  <Typography
                    text={`<b class='text-textDark'>Illustrator: </b><span class='text-textMid'>${currentStoryBook.illustrator}</span>`}
                    type={'markdown'}
                    color="textDark"
                  />
                )}
                <Divider dividerType="dashed" className="my-4" />
                <Typography text={'Key words'} type={'h3'} color="textDark" />
                <div className={'mb-4 flex flex-row flex-wrap'}>
                  {currentStoryBook.keywords.split(',')?.map((keyword) => (
                    <StatusChip
                      key={keyword}
                      text={keyword}
                      className={'mr-2 mt-2'}
                      textColour={'secondary'}
                      backgroundColour={'secondaryAccent2'}
                      borderColour={'secondaryAccent2'}
                      textType="help"
                    />
                  ))}
                </div>
              </>
            )}

            {currentStoryBook?.type === StoryBookTypes.readAloud && (
              <>
                <Typography
                  text={
                    'Where can you find a copy of this read aloud story for print or download?'
                  }
                  type={'unspecified'}
                />
                <ul className={'ml-4 mt-4 list-disc'}>
                  <li>
                    <Typography
                      text={currentStoryBook.bookLocation}
                      type={'unspecified'}
                      underline
                      hasMarkup
                      color={
                        stripPTag(currentStoryBook.bookLocation).match(URL)
                          ? 'primary'
                          : 'black'
                      }
                      onClick={() => {
                        onBookLocationClicked(currentStoryBook.bookLocation);
                      }}
                      fontSize={'14'}
                    />
                  </li>
                </ul>
              </>
            )}
          </div>
        )}

        <div className={'bg-uiBg flex w-full flex-col px-4'}>
          {currentStoryBook?.type === StoryBookTypes.other &&
            !currentStoryBookParts && (
              <div className={'flex flex-col items-start justify-start'}>
                <Typography
                  text={'Ideas for finding story books for this week’s theme:'}
                  type={'unspecified'}
                />
                <ul className={'ml-4 mt-4 list-disc'}>
                  <li>
                    <Typography
                      text={'Visit your local library'}
                      type={'unspecified'}
                      fontSize={'14'}
                    />
                  </li>
                  <li>
                    <Typography
                      text={
                        'Join a book club or ask your club or community to share books'
                      }
                      type={'unspecified'}
                      fontSize={'14'}
                    />
                  </li>
                </ul>

                <Typography
                  className={'mt-2'}
                  text={'Use an online resource'}
                  type={'unspecified'}
                />

                <Typography
                  className={'mt-4'}
                  text={'SmartStart ->'}
                  color={'primary'}
                  fontSize={'12'}
                  type={'unspecified'}
                  onClick={() => {
                    window.open('www.google.com', '_blank');
                  }}
                />
                <Typography
                  className={'mt-4'}
                  text={'Bookdash ->'}
                  color={'primary'}
                  fontSize={'12'}
                  type={'unspecified'}
                  onClick={() => {
                    window.open('www.google.com', '_blank');
                  }}
                />
                <Typography
                  className={'mt-4'}
                  text={"Nal'ibali ->"}
                  color={'primary'}
                  fontSize={'12'}
                  type={'unspecified'}
                  onClick={() => {
                    window.open('www.google.com', '_blank');
                  }}
                />

                <Button
                  className={'mt-4'}
                  color={'primary'}
                  type={'outlined'}
                  size={'small'}
                  onClick={() => {}}
                >
                  <img
                    src={getLogo(LogoSvgs.whatsapp)}
                    className={'text-primary mr-1 h-5 w-5'}
                    alt="whatsapp"
                  />
                  <Typography
                    color={'primary'}
                    type={'small'}
                    text={`Get Nal’ibali stories on Whatsapp`}
                  />
                </Button>

                <Alert
                  className={'my-4'}
                  type={'info'}
                  message={
                    'WhatsApps will be charged at your standard carrier rates.'
                  }
                />

                <Typography
                  text={'Ideas for making your own stories:'}
                  type={'unspecified'}
                />
                <ul className={'ml-4 mt-4 list-disc'}>
                  <li>
                    <Typography
                      text={`Find pictures of this week's theme in a magazine and make your own book for the children`}
                      type={'unspecified'}
                      fontSize={'14'}
                    />
                  </li>
                  <li>
                    <Typography
                      text={
                        'Use your imagination to make up your own story and use expressions'
                      }
                      type={'unspecified'}
                      fontSize={'14'}
                    />
                  </li>
                  <li>
                    <Typography
                      text={
                        'Use objects or toys such as puppets, dolls, or items related to this week’s theme'
                      }
                      type={'unspecified'}
                      fontSize={'14'}
                    />
                  </li>
                  <li>
                    <Typography
                      text={
                        'Ask children for ideas to make a story - ask them for characters, what happens in the story and use these ideas to plan a story for the following day'
                      }
                      type={'unspecified'}
                      fontSize={'14'}
                    />
                  </li>
                </ul>
              </div>
            )}

          {currentStoryBook &&
            currentStoryBookParts &&
            currentStoryBookParts.sort((a, b) => a.id - b.id) &&
            currentStoryBookParts?.map((bookPart) => {
              return (
                <div
                  key={bookPart.id}
                  className={
                    'bg-uiBg mt-4 flex w-full flex-col items-stretch justify-start pb-6'
                  }
                >
                  <div
                    className={
                      'relative flex flex-row items-start justify-start'
                    }
                  >
                    <div
                      className={
                        'relative z-10 mr-4 flex h-8 w-8 flex-shrink-0 flex-col items-center justify-center rounded-full'
                      }
                      style={{ backgroundColor: getAvatarColor() }}
                    >
                      <Typography
                        type="h3"
                        color={'white'}
                        text={bookPart.part}
                      />
                    </div>

                    <div className={'flex w-11/12 flex-col'}>
                      <Typography
                        type={'h4'}
                        color="textDark"
                        text={bookPart.partText}
                      />
                    </div>
                  </div>

                  {bookPart.storyBookPartQuestions?.map((question) => (
                    <div
                      className={'mt-2 flex flex-row items-start'}
                      key={question.id}
                    >
                      <div
                        className={'mr-4 flex w-1/12 flex-row justify-center'}
                      >
                        <RoundIcon
                          size={{ h: '8', w: '8' }}
                          icon={'PhotographIcon'}
                          iconSize={{ h: '5', w: '5' }}
                          className={'bg-primary text-white'}
                        />
                      </div>
                      <div className={'flex w-11/12 flex-col'}>
                        <Typography
                          type={'unspecified'}
                          fontSize={'14'}
                          color={'textMid'}
                          text={question.question}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
        <div
          className={
            'mb-4 mt-8 flex w-full flex-col items-start justify-start px-4'
          }
        >
          {!disabled &&
            (isSelected ? (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-2 w-full'}
                textColor={'white'}
                text={'Change story & activity'}
                icon={'RefreshIcon'}
                iconPosition={'start'}
                onClick={onStorySwitched}
              />
            ) : (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-2 w-full'}
                textColor={'white'}
                text={'Choose this story'}
                icon={'SwitchVerticalIcon'}
                iconPosition={'start'}
                onClick={onStorySelected}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

type StorybookActivityDetailsProps = {
  activity: ActivityDto;
  linkedStory?: StoryBookDto;
  isSelected: boolean;
  disabled?: boolean;
  onActivitySelected?: () => void;
  onActivitySwitched?: () => void;
  onStorySwitched?: () => void;
};

const StorybookActivityDetails: React.FC<StorybookActivityDetailsProps> = ({
  activity,
  linkedStory,
  isSelected,
  disabled,
  onActivitySelected,
  onActivitySwitched,
  onStorySwitched,
}) => {
  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const [isOnlineOnlyAlert, setOnlineOnlyAlert] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(activity);
  const authUser = useSelector(authSelectors.getAuthUser);
  const languages = useSelector(staticDataSelectors.getLanguages);
  const defaultLanguage = languages?.find(
    (item: LanguageDto) => item?.locale === 'en-za'
  );

  const { isOnline } = useOnlineStatus();

  const handleActivitySwitched = () => {
    if (isOnline) {
      onActivitySwitched?.();
    } else {
      setOnlineOnlyAlert(true);
    }
  };

  const regex = /(<([^>]+)>)/gi;
  const secondRegEx = /((&nbsp;))*/gim;

  const getDataByLanguage = async (language: LanguageDto) => {
    const hasTranslations = activity?.availableLanguages?.some(
      (item) => item.id === language.id
    );

    if (hasTranslations) {
      let activities: ActivityDto[] | undefined;

      activities = await new ContentActivityService(
        authUser?.auth_token || ''
      ).getActivities(language.locale);

      const translatedActivity = activities?.find(
        (item) => item.id === currentActivity.id
      );
      setCurrentActivity(translatedActivity || activity);
    }
  };

  const availableLanguages: LanguageCode[] = activity?.availableLanguages
    ?.length
    ? activity.availableLanguages?.map((item) => {
        return item?.locale as LanguageCode;
      })
    : [defaultLanguage?.locale as LanguageCode];

  return (
    <div className={'flex flex-col'}>
      <div className={'flex flex-col pb-24'}>
        <div className="bg-uiBg w-full">
          <LanguageSelector
            labelClassName="text-textDark mr-2"
            currentLocale={'en-za'}
            availableLanguages={availableLanguages}
            selectLanguage={getDataByLanguage}
          />
        </div>
        {isOnlineOnlyAlert && (
          <div className="absolute  z-10 flex h-full items-center ">
            <div className="rounded-10 z-10 mx-4 bg-white opacity-100">
              <OnlineOnlyModal
                onSubmit={() => setOnlineOnlyAlert(false)}
              ></OnlineOnlyModal>
            </div>
            <div className="absolute z-0 h-full w-full bg-gray-600 opacity-40"></div>
          </div>
        )}
        <Typography
          className="mt-6 px-4"
          text={currentActivity.name}
          type={'h1'}
          color={'primary'}
        />
        <Typography
          className="mt-2 px-4"
          type="markdown"
          fontSize="14"
          text={currentActivity.materials}
        />
        {!disabled &&
          (isSelected ? (
            <div className="pl-4 pr-4">
              <Button
                type={'filled'}
                className={'mt-4 w-full'}
                color={'quatenary'}
                textColor={'white'}
                text={'Change activity'}
                icon={'RefreshIcon'}
                iconPosition={'start'}
                onClick={handleActivitySwitched}
              />
            </div>
          ) : (
            <Button
              type={'filled'}
              className={'mx-4 mt-4'}
              color={'quatenary'}
              textColor={'white'}
              text={'Choose this activity'}
              icon={'CheckCircleIcon'}
              iconPosition={'start'}
              onClick={onActivitySelected}
            />
          ))}
        <Divider dividerType="dashed" className={'mx-4 mt-4'} />
        {linkedStory && (
          <div className="flex flex-col bg-white">
            <div className="mt-4 px-4">
              <Typography text="Story chosen:" type="h2" color="textDark" />
            </div>
            <StoryCard
              title={linkedStory.name}
              storyBookId={linkedStory.id}
              type={linkedStory.type}
              languages={linkedStory.availableLanguages}
              selected={isSelected}
              hideDetails
              buttonIcon="SwitchVerticalIcon"
              buttonText="Change story"
              onSelected={() => {}}
              onCleared={() => {}}
              radioEnabled={false}
              className="mx-4"
            />
          </div>
        )}

        <div className="mt-4 px-4">
          <Typography
            type="markdown"
            fontSize="14"
            text={currentActivity.description}
          />
        </div>
        {currentActivity.notes && (
          <div className="mt-2 p-4">
            <Alert
              title={'Tips'}
              className={'mt-4'}
              type={'info'}
              message={currentActivity.notes
                .replace(regex, '')
                .replace(secondRegEx, '')}
            />
          </div>
        )}
        {!disabled &&
          (isSelected ? (
            <div className="pl-4 pr-4">
              <Button
                type={'filled'}
                className={'mt-4 w-full'}
                color={'quatenary'}
                textColor={'white'}
                text={'Change activity'}
                icon={'RefreshIcon'}
                iconPosition={'start'}
                onClick={handleActivitySwitched}
              />
            </div>
          ) : (
            <Button
              type={'filled'}
              className={'mx-4 mt-4'}
              color={'quatenary'}
              textColor={'white'}
              text={'Choose this activity'}
              icon={'CheckCircleIcon'}
              iconPosition={'start'}
              onClick={onActivitySelected}
            />
          ))}
      </div>
    </div>
  );
};

export default StoryActivityDetails;
