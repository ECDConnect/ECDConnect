import {
  ActivityDto,
  getAvatarColor,
  StoryBookDto,
  LanguageDto,
  useDialog,
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
import React, { useState } from 'react';
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

const StoryActivityDetails: React.FC<StoryActivityDetailsProps> = ({
  storyBookId,
  activityId,
  viewType,
  disabled,
  onStoryBookSelected,
  onStoryBookSwitched,
  onActivitySelected,
  onActivitySwitched,
  onBack,
  selected,
}) => {
  const { isOnline } = useOnlineStatus();
  const activityDetail = useSelector(
    activitySelectors.getActivityById(activityId)
  );
  const storyBook = useSelector(
    storyBookSelectors.getStoryBookById(storyBookId)
  );

  const title =
    viewType === 'StoryBook' ? storyBook?.name : activityDetail?.name;
  const subTitle = viewType === 'StoryBook' ? 'Story' : 'Story Activity';

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
      onBack={onBack}
      displayOffline={!isOnline}
    >
      {viewType === 'StoryBook' ? (
        <StoryBookDetails
          disabled={disabled}
          storyBook={storyBook as StoryBookDto}
          onStorySelected={onStoryBookSelected}
          onStorySwitched={onStoryBookSwitched}
          onActivitySwitched={onActivitySwitched}
          isSelected={selected}
          linkedActivity={activityDetail}
        />
      ) : (
        <StorybookActivityDetails
          disabled={disabled}
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

    if (hasTranslations && language.locale !== 'en-za') {
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
        <LanguageSelector
          currentLocale={'en-za'}
          availableLanguages={
            storyBook?.availableLanguages || [defaultLanguage]
          }
          selectLanguage={getDataByLanguage}
        />
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
          <Typography
            text={currentStoryBook.name}
            type={'h1'}
            color={'textDark'}
            className={'mt-2'}
          />
          <div
            className={
              'align-center flex flex-row items-center justify-between'
            }
          >
            <Typography
              text={`Author: ${currentStoryBook.author}`}
              type={'h4'}
              color={'textDark'}
              className={'mt-2'}
            />
            <StatusChip
              backgroundColour={'primaryAccent2'}
              borderColour={'primaryAccent2'}
              textColour={'primary'}
              textType={'help'}
              text={currentStoryBook.type}
            />
          </div>
          {!disabled &&
            (isSelected ? (
              <Button
                type={'filled'}
                color={'primary'}
                className={'mt-6 w-full'}
                textColor={'white'}
                text={`Change story ${linkedActivity ? 'and activity' : ''}`}
                icon={'SwitchVerticalIcon'}
                iconPosition={'start'}
                onClick={onStorySwitched}
              />
            ) : (
              <Button
                type={'filled'}
                color={'primary'}
                className={'mt-6 w-full'}
                textColor={'white'}
                text={'Choose this story'}
                icon={'CheckCircleIcon'}
                iconPosition={'start'}
                onClick={onStorySelected}
              />
            ))}
          <Divider dividerType="dashed" className={'mt-4'} />
          {linkedActivity && (
            <div className={'flex flex-col'}>
              <Typography type={'body'} text={'Linked activity'} />
              <StoryActivityCard
                title={linkedActivity.name}
                activityId={linkedActivity.id}
                material={linkedActivity.materials}
                hideDetails={true}
                selected={true}
                buttonIcon={'SwitchVerticalIcon'}
                buttonText={'Change activity'}
                onSelected={() =>
                  onActivitySwitched && isOnline
                    ? onActivitySwitched()
                    : setOnlineOnlyAlert(true)
                }
                onCleared={() => {}}
              />
            </div>
          )}
        </div>

        {currentStoryBook?.type !== StoryBookTypes.other && (
          <div className={'bg-white p-4'}>
            {currentStoryBook?.type === StoryBookTypes.storyBook && (
              <>
                <Typography
                  text={'Where can you find a copy of this story book'}
                  type={'unspecified'}
                  weight={'bold'}
                />
                <ul className={'ml-4 mt-4 list-disc'}>
                  <li>
                    <Typography
                      text={currentStoryBook.bookLocation}
                      type={'unspecified'}
                      underline
                      color={
                        stripPTag(currentStoryBook.bookLocation).match(URL)
                          ? 'infoBb'
                          : 'black'
                      }
                      onClick={() => {
                        onBookLocationClicked(currentStoryBook.bookLocation);
                      }}
                      fontSize={'14'}
                    />
                  </li>
                </ul>
                <Typography
                  text={'Key words:'}
                  type={'unspecified'}
                  className={'bold mt-4'}
                />
                <div className={'flex flex-row flex-wrap'}>
                  {currentStoryBook.keywords.split(',')?.map((keyword) => (
                    <StatusChip
                      key={keyword}
                      text={keyword}
                      className={'mr-2 mt-4'}
                      textColour={'secondary'}
                      backgroundColour={'secondaryAccent2'}
                      borderColour={'secondaryAccent2'}
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
          {currentStoryBook?.type === StoryBookTypes.other && (
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
            currentStoryBook.type !== StoryBookTypes.other &&
            currentStoryBookParts &&
            currentStoryBookParts?.map((bookPart) => (
              <div
                key={bookPart.id}
                className={
                  'bg-uiBg mt-4 flex w-full flex-col items-stretch justify-start py-4'
                }
              >
                <div className={'flex flex-row items-start justify-start'}>
                  <div className={'mr-4 flex w-1/12 flex-row justify-center'}>
                    <div
                      className={
                        'flex h-9 w-9 flex-shrink-0 flex-col items-center justify-center rounded-full'
                      }
                      style={{ backgroundColor: getAvatarColor() }}
                    >
                      <Typography
                        type={'markdown'}
                        fontSize={'16'}
                        color={'white'}
                        text={bookPart.part}
                      />
                    </div>
                  </div>

                  <div className={'flex w-11/12 flex-col'}>
                    <Typography
                      type={'h4'}
                      fontSize={'14'}
                      text={bookPart.partText}
                    />
                  </div>
                </div>

                {bookPart.storyBookPartQuestions?.map((question) => (
                  <div
                    className={'mt-2 flex flex-row items-start'}
                    key={question.id}
                  >
                    <div className={'mr-4 flex w-1/12 flex-row justify-center'}>
                      <RoundIcon
                        size={{ h: '7', w: '7' }}
                        icon={'PhotographIcon'}
                        iconSize={{ h: '5', w: '5' }}
                        className={'bg-primary text-white'}
                      />
                    </div>
                    <div className={'flex w-11/12 flex-col'}>
                      <Typography
                        type={'markdown'}
                        fontSize={'14'}
                        color={'textMid'}
                        text={question.question}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div
          className={'mb-20 flex w-full flex-col items-start justify-start p-4'}
        >
          {!disabled &&
            (isSelected ? (
              <Button
                type={'filled'}
                color={'primary'}
                className={'mt-2 w-full'}
                textColor={'white'}
                text={`Change story ${linkedActivity ? 'and activity' : ''}`}
                icon={'SwitchVerticalIcon'}
                iconPosition={'start'}
                onClick={onStorySwitched}
              />
            ) : (
              <Button
                type={'filled'}
                color={'primary'}
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

    if (hasTranslations && language.locale !== 'en-za') {
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

  return (
    <div className={'flex flex-col'}>
      <div className={'flex flex-col pb-24'}>
        <LanguageSelector
          currentLocale={'en-za'}
          availableLanguages={activity?.availableLanguages || [defaultLanguage]}
          selectLanguage={getDataByLanguage}
        />
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
        <Divider />
        <Typography
          className="mt-2 px-4"
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
                color={'primary'}
                textColor={'white'}
                text={'Change activity'}
                icon={'SwitchVerticalIcon'}
                iconPosition={'start'}
                onClick={handleActivitySwitched}
              />
            </div>
          ) : (
            <Button
              type={'filled'}
              className={'mx-4 mt-4'}
              color={'primary'}
              textColor={'white'}
              text={'Choose this activity'}
              icon={'CheckCircleIcon'}
              iconPosition={'start'}
              onClick={onActivitySelected}
            />
          ))}
        <Divider dividerType="dashed" className={'mx-4 mt-4'} />
        {!disabled && linkedStory && (
          <div className={'flex flex-col bg-white'}>
            <div className="mt-4 px-4">
              <Typography
                text={`Story chosen:`}
                type={'h2'}
                color={'textDark'}
              />
            </div>
            <StoryCard
              title={linkedStory.name}
              storyBookId={linkedStory.id}
              type={linkedStory.type}
              languages={linkedStory.availableLanguages}
              selected={false}
              hideDetails={true}
              buttonIcon={'SwitchVerticalIcon'}
              buttonText={'Change story'}
              onSelected={() => {}}
              onCleared={() => {}}
              radioEnabled={false}
              className={'mx-4'}
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
                color={'primary'}
                textColor={'white'}
                text={'Change activity'}
                icon={'SwitchVerticalIcon'}
                iconPosition={'start'}
                onClick={handleActivitySwitched}
              />
            </div>
          ) : (
            <Button
              type={'filled'}
              className={'mx-4 mt-4'}
              color={'primary'}
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
