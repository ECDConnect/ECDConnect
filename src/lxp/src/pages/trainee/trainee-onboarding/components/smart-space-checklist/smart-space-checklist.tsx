import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { authSelectors } from '@/store/auth';
import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  Dialog,
  DialogPosition,
  MenuListDataItem,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ProgrammeDetails } from './components/programme-details/programme-details';
import {
  CmsQuestionInput,
  CmsVisitDataInputModelInput,
  CmsVisitSectionInput,
  InputMaybe,
} from '@ecdlink/graphql';
import { newGuid } from '@/utils/common/uuid.utils';
import { traineeSelectors } from '@/store/trainee';
import { SectionQuestions } from './components/programme-details/programme-details.types';
import { TraineeService } from '@/services/TraineeService';

interface SmartSpaceChecklistProps {
  setNotificationStep: any;
}

export const SmartSpaceChecklist: React.FC<SmartSpaceChecklistProps> = ({
  setNotificationStep,
}) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const date = format(new Date(), 'EEEE, d LLLL');
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [sectionQuestions, setSectionQuestions] =
    useState<SectionQuestions[]>();
  const [visitSection, setVisitSection] = useState('');
  const [showProgrammeDetails, setShowProgrammeDetails] = useState(false);
  const a = true;
  const trainee = useSelector(traineeSelectors.getTrainee);

  const onSubmit = async () => {
    const questionsPayload = sectionQuestions;

    const sections = sectionQuestions?.map((item) => ({
      ...item,
      questions: item.questions.map((question) => ({
        ...question,
        answer: String(question.answer),
      })),
    })) as InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;

    const visitDateInput: CmsVisitDataInputModelInput = {
      visitId: await newGuid(),
      traineeId: trainee?.id,
      visitData: {
        visitName: 'SmartSpace Checklist',
        sections,
      },
    };

    await new TraineeService(userAuth?.auth_token!).addVisitData(
      visitDateInput
    );
  };

  const notificationItems: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'DocumentTextIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Programme details',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 6 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () => setShowProgrammeDetails(true),
    },
    {
      showIcon: true,
      menuIcon: 'PlusCircleIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Health, sanitation & safety',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 6 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () => {},
    },
  ];

  const notificationItemsLaterStage: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'ShieldExclamationIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Space & emergency planning',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 4 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () => {},
    },
  ];

  if (a) {
    notificationItems.push({
      showIcon: true,
      menuIcon: 'ShieldCheckIcon',
      menuIconClassName: 'border-0',
      iconColor: 'white',
      title: 'Safety - structure & area',
      titleStyle: 'text-textDark semibold',
      subTitle: '0 of 10 completed',
      subTitleStyle: 'text-textMid',
      iconBackgroundColor: 'tertiary',
      backgroundColor: 'uiBg',
      onActionClick: () => {},
    });
  }

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Business'}
      subTitle={date}
      color={'primary'}
      onBack={history.goBack}
      displayOffline={!isOnline}
      renderOverflow={true}
    >
      <div className="flex flex-col justify-around p-4">
        <div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'SmartSpace checklist'}
          />
          <Alert
            className={'mt-5 mb-3'}
            title="Use this list to check if your venue meets the SmartStart standards."
            list={[
              'As you prepare your venue, you can track your progress here.',
            ]}
            type={'info'}
          />
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'SmartSpace checklist'}
          />
          <StackedList
            isFullHeight={false}
            className={'flex flex-col gap-2'}
            listItems={notificationItems}
            type={'MenuList'}
          />
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'You can complete these steps at a later stage'}
          />
          <StackedList
            isFullHeight={false}
            className={'flex flex-col gap-2'}
            listItems={notificationItemsLaterStage}
            type={'MenuList'}
          />
        </div>
      </div>
      <Dialog
        stretch={true}
        fullScreen={true}
        visible={showProgrammeDetails}
        position={DialogPosition.Middle}
      >
        <ProgrammeDetails
          setSectionQuestions={setSectionQuestions}
          setShowProgrammeDetails={setShowProgrammeDetails}
          setVisitSection={setVisitSection}
          onSubmit={onSubmit}
        />
      </Dialog>
    </BannerWrapper>
  );
};
