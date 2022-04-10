import { renderIcon, Typography } from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ACTIVITY_PAGE_SIZE } from '../../../../../../../../../constants/ActivitySearch';
import { activitySelectors } from '@store/content/activity';
import { programmeSelectors } from '@store/programme';
import { getSelectedActivityWarningText } from '../../../../../../../../../utils/classroom/programme-planning/programmes.utils';
import StoryActivityCard from '../../../story-activity-card/story-activity-card';
import StoryCard from '../../../story-card/story-card';
import { StoryActivitySelectViewProps } from './story-activity-select.types';

export const StoryActivitySelectView: React.FC<StoryActivitySelectViewProps> = ({
  story,
  programmeId,
  selectedActivityId,
  onActivitySelected,
  onActivityCleared,
  onClearStory,
}) => {
  const storyActivities = useSelector(activitySelectors.getStoryActivitiesByType(story.type));

  const programme = useSelector(programmeSelectors.getProgrammeById(programmeId));
  const handleClearStory = () => {
    onClearStory && onClearStory();
  };
  const [pageSize, setPageSize] = useState(ACTIVITY_PAGE_SIZE);

  return (
    <div className={'flex flex-col'}>
      <StoryCard
        storyBookId={story.id}
        activityId={selectedActivityId}
        title={story.name}
        type={story.type}
        languages={story.availableLanguages}
        selected
        onSelected={handleClearStory}
        onCleared={handleClearStory}
      />
      <div className={'flex flex-row items-center justify-center my-2'}>
        {renderIcon('ArrowCircleLeftIcon', 'w-5 h-5 text-primary mr-2')}
        <Typography
          text={'<u>Choose a different story</u>'}
          hasMarkup
          color={'primary'}
          type={'markdown'}
          onClick={handleClearStory}
        />
      </div>

      <Typography
        text={'Now, choose an <u>activity</u> for this story'}
        hasMarkup
        color={'black'}
        type={'markdown'}
        align={'left'}
      />

      {storyActivities &&
        storyActivities.slice(0, pageSize).map((activity) => {
          const isSelected = selectedActivityId === activity.id;
          return (
            <StoryActivityCard
              key={activity.id}
              className={'mt-2'}
              activityId={activity.id}
              material={activity.materials}
              warningText={isSelected ? getSelectedActivityWarningText(activity, programme) : ''}
              onSelected={() => {
                onActivitySelected(activity);
              }}
              onCleared={() => {
                onActivityCleared();
              }}
              onStoryCleared={() => onClearStory()}
              selected={selectedActivityId === activity.id}
              title={activity.name}
            />
          );
        })}
      {pageSize < storyActivities.length && (
        <Typography
          onClick={() => setPageSize(pageSize + ACTIVITY_PAGE_SIZE)}
          className={'mt-2'}
          align={'center'}
          text={'<u>See more activities</u>'}
          hasMarkup
          type={'unspecified'}
          color={'primary'}
        />
      )}
    </div>
  );
};
