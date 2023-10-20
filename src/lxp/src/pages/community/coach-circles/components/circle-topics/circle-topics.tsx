import { coachSelectors } from '@/store/coach';
import {
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { getYear } from 'date-fns';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TopicDescription } from './components/topic-description';
import { CoachingCircleTopicDto } from '@ecdlink/core';
import { coachThunkActions } from '@/store/coach';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface CircleTopicsProps {
  setShowAddCircles: (item: boolean) => void;
  setShowCircleTopics: (item: boolean) => void;
}

export const CircleTopics: React.FC<CircleTopicsProps> = ({
  setShowCircleTopics,
  setShowAddCircles,
}) => {
  const year = getYear(new Date());
  const circleTopics = useSelector(coachSelectors.getCircleTopics);
  const [showDescription, setShowDescription] = useState(false);
  const [circleTopic, setCircleTopic] = useState<CoachingCircleTopicDto>();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [language, setLanguage] = useState({ locale: 'en-za' });

  const handleTopicDescription = (topic: CoachingCircleTopicDto) => {
    setCircleTopic(topic);
    setShowDescription(true);
  };

  const circleTopicsMenuList = useMemo(
    () =>
      circleTopics?.map(
        (item): MenuListDataItem => ({
          title: item?.title,
          titleStyle: 'text-textDark',
          subTitle: '',
          backgroundColor: 'uiBg',
          onActionClick: () => handleTopicDescription(item),
        })
      ),
    [circleTopics]
  );

  const getContent = useCallback(async () => {
    if (!isOnline) return;

    appDispatch(
      coachThunkActions.getCoachingCircleTopics({
        locale: language.locale,
      })
    );
  }, [appDispatch, isOnline, language.locale]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <BannerWrapper
      size={'normal'}
      renderBorder={true}
      title={'Coaching circle topics'}
      onBack={() => setShowCircleTopics(false)}
      renderOverflow
      backgroundColour={'white'}
    >
      <div className="flex flex-col gap-4 p-4">
        <Typography
          type="h2"
          color="textDark"
          text={`${year} Coaching circle topics`}
          className="mt-4"
        />
        <StackedList
          className="mt-4 flex w-full flex-col gap-1"
          type="MenuList"
          listItems={circleTopicsMenuList || []}
        />
        <div className="absolute bottom-0 left-0 right-0 max-h-40 bg-white p-4">
          <Button
            onClick={() => {
              setShowCircleTopics(false);
              setShowAddCircles(true);
            }}
            className="mb-4 w-full rounded-2xl"
            size="small"
            color="primary"
            type="filled"
          >
            {renderIcon('PlusCircleIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h6"
              className="ml-2"
              text="Add a coaching circle"
              color="white"
            />
          </Button>
        </div>
      </div>
      <Dialog
        visible={showDescription}
        stretch={true}
        position={DialogPosition.Full}
      >
        <TopicDescription
          setShowCircleTopics={setShowDescription}
          circleTopic={circleTopic}
        />
      </Dialog>
    </BannerWrapper>
  );
};
