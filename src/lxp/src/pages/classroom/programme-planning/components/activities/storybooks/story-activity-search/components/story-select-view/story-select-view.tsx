import { Typography } from '@ecdlink/ui';
import { useState } from 'react';
import { ACTIVITY_PAGE_SIZE } from '../../../../../../../../../constants/ActivitySearch';
import StoryCard from '../../../story-card/story-card';
import { StoryCardProps } from '../../../story-card/story-card.types';
import { StorySelectViewProps } from './story-select-view.types';

export const StorySelectView: React.FC<StorySelectViewProps> = ({
  stories,
  onStorySelected,
  selectedStoryBookId,
}) => {
  const storieProps: StoryCardProps[] = stories.map((item) => ({
    storyBookId: item.id,
    title: item.name,
    type: item.type,
    languages: item.availableLanguages,
    selected: selectedStoryBookId == item.id,
    onSelected: () => {
      onStorySelected(item);
    },
    onCleared: () => {},
  }));

  const [pageSize, setPageSize] = useState(ACTIVITY_PAGE_SIZE);

  return (
    <>
      {storieProps.slice(0, pageSize).map((story, idx) => {
        return <StoryCard key={`story-card-${idx}`} {...story} />;
      })}
      {pageSize < storieProps.length && (
        <Typography
          onClick={() => setPageSize(pageSize + ACTIVITY_PAGE_SIZE)}
          className={'mt-2'}
          align={'center'}
          text={'<u>See more stories</u>'}
          hasMarkup
          type={'unspecified'}
          color={'primary'}
        />
      )}
    </>
  );
};
