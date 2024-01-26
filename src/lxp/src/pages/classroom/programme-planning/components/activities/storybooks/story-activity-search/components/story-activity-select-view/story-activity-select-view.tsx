import { Button, Typography } from '@ecdlink/ui';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ACTIVITY_PAGE_SIZE } from '../../../../../../../../../constants/ActivitySearch';
import { activitySelectors } from '@store/content/activity';
import { programmeSelectors } from '@store/programme';
import { getSelectedActivityWarningText } from '@utils/classroom/programme-planning/programmes.utils';
import StoryActivityCard from '../../../story-activity-card/story-activity-card';
import { StoryActivitySelectViewProps } from './story-activity-select.types';

export const StoryActivitySelectView: React.FC<
  StoryActivitySelectViewProps
> = ({
  story,
  programmeId,
  selectedActivityId,
  onActivitySelected,
  onActivityCleared,
  onClearStory,
  setSelectedStory,
}) => {
  const storyActivities = useSelector(
    activitySelectors.getStoryActivitiesByType(story.type)
  );

  const programme = useSelector(
    programmeSelectors.getProgrammeById(programmeId)
  );
  const handleClearStory = () => {
    onClearStory && onClearStory();
  };
  const [pageSize, setPageSize] = useState(ACTIVITY_PAGE_SIZE);

  return (
    <div className={'flex flex-col'}>
      <Typography
        text={`Story chosen: ${story.name}`}
        className={'mt-4'}
        color={'textDark'}
        type={'h2'}
        onClick={handleClearStory}
      />
      <Button
        type={'filled'}
        color={'primary'}
        className={'mt-4 w-full'}
        textColor={'white'}
        text={'Choose a different story'}
        icon={'CheckCircleIcon'}
        iconPosition={'start'}
        onClick={() => onClearStory()}
      />

      <Typography
        text={'Choose a story activity'}
        color={'black'}
        type={'h2'}
        align={'left'}
        className={'mt-4'}
      />
      <Typography
        text={'Step 2 of 2'}
        hasMarkup
        color={'black'}
        type={'markdown'}
        align={'left'}
        className={'mt-2'}
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
              warningText={
                isSelected
                  ? getSelectedActivityWarningText(activity, programme)
                  : ''
              }
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
        <Button
          size="normal"
          className="mb-4 mt-3 w-full"
          type="outlined"
          color="primary"
          text="See more activities"
          textColor="primary"
          icon="EyeIcon"
          onClick={() => setPageSize(pageSize + ACTIVITY_PAGE_SIZE)}
        />
      )}
    </div>
  );
};
