import {
  Card,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { ReportMonths, monthsNames } from '../../tl-meetings.types';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  GetAllLanguage,
  GetAllTopic,
  contentDefinitions,
  contentTypes,
} from '@ecdlink/graphql';
import { ContentTypeDto } from '@ecdlink/core';
import { getDate, getMonth, getYear } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import EditTopicsForm from './edit-topics-form';
import { ContentManagementView } from '../../../content-management/content-management-models';
import { ContentTypes } from '../../../../constants/content-management';
import { LanguageId } from '../../../../constants/language';
import { InformationCircleIcon } from '@heroicons/react/solid';

export const EditTopics = () => {
  const [openToppic, setOpenTopic] = useState(false);
  const [selectedType, setSelectedType] = useState<ContentTypeDto>();
  const [languageId, setLanguageId] = useState<string>(LanguageId?.enZa);
  const blueCardTitleText = `You must add a topic for each month in the year.`;
  const blueCardSubtitleText = `• You can start adding topics for next year by 8 November of the current year.`;

  const {
    data: topicData,
    refetch: refetchTopicData,
    loading: loadingTopicData,
  } = useQuery(GetAllTopic, {
    fetchPolicy: 'network-only',
    variables: {
      localeId: '9688cd08-adef-408c-9d34-5d75ae5c44df',
    },
  });

  const [selectedContent, setSelectedContent] =
    useState<ContentManagementView>();

  const { data: languages } = useQuery(GetAllLanguage, {
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: dataDefinitions,
    refetch: refrechDefinitions,
    loading: loadingRefetchDefinitions,
  } = useQuery(contentDefinitions, {
    fetchPolicy: 'cache-and-network',
  });

  const [
    getContentTypes,
    {
      data: dataTypes,
      loading: isLoadingSelectedRow,
      refetch: refetchDataTypes,
    },
  ] = useLazyQuery(contentTypes, {
    variables: {
      search: '',
      searchInContent: null,
      isVisiblePortal: true,
    },
    fetchPolicy: 'cache-and-network',
  });

  const refreshParent = () => {
    refetchTopicData();
    refrechDefinitions();
    setOpenTopic(false);
    refetchDataTypes();
  };

  const topicType = dataTypes?.contentTypes?.find(
    (item) => item?.name === ContentTypes?.TOPIC
  );

  const getContentValues = (contentManagementView?: ContentManagementView) => {
    refetchTopicData().then(() => {
      const currentType = dataTypes?.contentTypes.find(
        (x: ContentTypeDto) => x.id === selectedType?.id
      );

      setSelectedType(currentType);
      setSelectedContent(contentManagementView);
    });
  };

  const handleEditTopic = (item?: any) => {
    const currentType = dataTypes?.contentTypes.find(
      (x: ContentTypeDto) => x.id === topicType?.id
    );
    setSelectedType(currentType);
    if (!item?.id) {
      const model: ContentManagementView = {
        content: {
          title: item,
          __typename: ContentTypes.TOPIC,
        },
        languageId: languageId ? languageId : '',
      };
      getContentValues(model);
      return;
    }
    const model: ContentManagementView = {
      content: item,
      languageId: languageId ? languageId : '',
    };

    getContentValues(model);
  };

  useEffect(() => {
    getContentTypes({
      variables: {
        search: '',
        searchInContent: true,
        isVisiblePortal: true,
      },
    });
  }, [getContentTypes]);

  const monthTopics = topicData?.GetAllTopic;

  const today = new Date();
  const todaysDateNumber = getDate(today);
  const currentMonth = getMonth(today);

  function monthName(mon) {
    if (mon === 0) {
      return `${monthsNames[11]}  ${getYear(today) - 1}`;
    }
    return `${monthsNames[mon - 1]} ${getYear(today)}`;
  }

  const reportMonthsFilteredByDate = useMemo(() => {
    if (todaysDateNumber < 8) {
      return ReportMonths?.filter(
        (item) => Number(item?.value) >= currentMonth
      );
    }

    return ReportMonths?.filter((item) => Number(item?.value) > currentMonth);
  }, [currentMonth, todaysDateNumber]);

  const monthsList: MenuListDataItem[] = reportMonthsFilteredByDate?.map(
    (month) => {
      const monthTopic = monthTopics?.find(
        (item) => item?.title === month?.label
      );
      return {
        title: month?.label,
        titleStyle: 'text-textDark semibold',
        subTitle: monthTopic
          ? monthTopic?.topicTitle
          : `No topic added! Add a topic by 1 ${monthName(
              Number(month?.value) - 1
            )}`,
        subTitleStyle: monthTopic ? 'text-textMid' : 'text-errorMain',
        backgroundColor: 'white',
        onActionClick: () => {
          handleEditTopic(monthTopic || month?.label);
          setOpenTopic(true);
        },
        className: 'rounded-xl',
      };
    }
  );

  if (openToppic && languages?.GetAllLanguage?.length > 0) {
    return (
      <EditTopicsForm
        contentView={selectedContent}
        contentType={topicType}
        goBack={() => {}}
        languages={languages?.GetAllLanguage}
        optionDefinitions={dataDefinitions.contentDefinitions}
        savedContent={() => refreshParent()}
        setOpenTopic={setOpenTopic}
      />
    );
  }

  if (loadingTopicData || loadingRefetchDefinitions || isLoadingSelectedRow) {
    return (
      <LoadingSpinner
        backgroundColor="secondary"
        spinnerColor="adminPortalBg"
        size="medium"
      />
    );
  }
  return (
    <div className="text-textDark">
      <div className="my-4 w-11/12">
        <Card className="bg-infoMain my-8 flex flex-col gap-2 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <Typography type={'h4'} text={blueCardTitleText} color={'white'} />
          </div>
          <Typography
            type={'body'}
            text={blueCardSubtitleText}
            color={'white'}
            className="ml-8"
          />
        </Card>
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
