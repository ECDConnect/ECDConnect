import { MenuListDataItem, StackedList } from '@ecdlink/ui';
import { ReportMonths } from '../tl-meetings.types';
import { useQuery } from '@apollo/client';
import { GetAllTopic } from '@ecdlink/graphql';

export const EditTopics = () => {
  // TODO: Implement the Edit topic integration in the next PR
  const {
    data: topicData,
    refetch: refetchTopicData,
    loading: loadingTopicData,
  } = useQuery(GetAllTopic, {
    fetchPolicy: 'cache-and-network',
    variables: {
      localeId: '9688cd08-adef-408c-9d34-5d75ae5c44df',
    },
  });

  const monthsList: MenuListDataItem[] = ReportMonths?.map((month) => {
    return {
      title: month?.label,
      titleStyle: 'text-textDark semibold',
      subTitle: `Deadline: `,
      subTitleStyle: 'text-textMid',
      backgroundColor: 'white',
      onActionClick: () => {},
      className: 'rounded-xl',
    };
  });

  return (
    <div className="text-textDark">
      <div className="my-4 w-11/12">
        <StackedList
          isFullHeight={false}
          className={'flex flex-col gap-2'}
          listItems={monthsList}
          type={'MenuList'}
        />
      </div>
    </div>
  );
};
