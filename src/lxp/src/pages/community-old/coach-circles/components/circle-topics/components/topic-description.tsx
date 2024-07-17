import LanguageSelector from '@/components/language-selector/language-selector';
import { CoachingCircleTopicDto } from '@ecdlink/core';
import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useMemo } from 'react';

interface TopicsDescriptionProps {
  setShowCircleTopics: (item: boolean) => void;
  circleTopic?: CoachingCircleTopicDto;
}

export const TopicDescription: React.FC<TopicsDescriptionProps> = ({
  setShowCircleTopics,
  circleTopic,
}) => {
  const circleTopicTitle = useMemo(
    () => circleTopic?.title,
    [circleTopic?.title]
  );

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      title={circleTopicTitle}
      subTitle="Coaching circle topic"
      onBack={() => setShowCircleTopics(false)}
      renderOverflow
      backgroundColour={'white'}
    >
      <LanguageSelector currentLocale={'en-za'} selectLanguage={() => {}} />
      <div className="flex flex-col gap-4 p-4">
        <Typography
          type="h2"
          color="textDark"
          weight="bold"
          text={circleTopicTitle}
        />
        <div
          className="text-textDark"
          dangerouslySetInnerHTML={{ __html: `${circleTopic?.topicContent}` }}
        />
      </div>
    </BannerWrapper>
  );
};
