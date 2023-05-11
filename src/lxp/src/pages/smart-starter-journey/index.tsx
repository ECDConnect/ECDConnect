import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getPractitionerById } from '@/store/practitioner/practitioner.selectors';
import {
  Alert,
  BannerWrapper,
  Button,
  MenuListDataItem,
  StackedList,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { ReactComponent as BalloonsIcon } from '@/assets/balloons.svg';
import { SmartStarterJourneyParams } from './smart-starter-journey.types';
import { useState } from 'react';
import { Form } from './forms';

const MOCKED_DATA = {
  visit: {
    title: 'First site visit',
    subTitle: 'By 10 April 2020',
  },
  alert: {
    title: 'SmartSpace Licence received',
    subTitle: '10 March 2020',
  },
  steps: [
    {
      title: 'Starter Licence received',
      subTitle: '22 Feb 2020',
      type: 'completed',
    },
    {
      title: 'Consolidation meeting attended',
      subTitle: '25 Feb 2020',
      type: 'completed',
      completedStepIcon: 'CalendarIcon',
      showAccordion: true,
    },
    {
      title: 'SmartSpace Licence received',
      subTitle: '10 Mar 2020',
      type: 'completed',
    },
    {
      title: 'Did not attend first aid course',
      subTitle: '5 Mar 2020',
      type: 'inProgress',
      inProgressStepIcon: 'ExclamationCircleIcon',
    },
    {
      title: '3/3 club meetings attended',
      subTitle: '25 Aug 2020',
      type: 'completed',
    },
    {
      title: 'Pre-PQA site visits',
      subTitle: 'By 10 Apr 2020',
      type: 'todo',
      showAccordion: true,
      accordionContent: <>Content</>,
    },
  ] as StepItem[],
};

export const currentActivityKey = 'selectedOption';

export const visitsTypes = {
  firstVisit: 'First site visit before PQA',
  secondVisit: 'Second site visit before PQA',
};

export const SmartStarterJourney: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const { isOnline } = useOnlineStatus();
  const history = useHistory();

  const { clientId } = useParams<SmartStarterJourneyParams>();

  // TODO: add integration
  const isCompletedFirstVisit = false;
  const currentVisit = isCompletedFirstVisit
    ? visitsTypes.secondVisit
    : visitsTypes.firstVisit;

  const practitioner = useSelector(getPractitionerById(clientId));

  const practitionerFirstName = practitioner?.user?.firstName;

  const visits: MenuListDataItem[] = [
    {
      showIcon: true,
      menuIcon: 'ClipboardListIcon',
      iconColor: 'white',
      title: currentVisit,
      subTitle: MOCKED_DATA.visit.subTitle,
      iconBackgroundColor: 'primary',
      backgroundColor: 'uiBg',
      onActionClick: () => {
        window.sessionStorage.setItem(currentActivityKey, currentVisit);
        setShowForm(true);
      },
    },
  ];

  if (showForm) {
    return <Form onBack={() => setShowForm(false)} />;
  }
  return (
    <BannerWrapper
      size="small"
      renderOverflow
      displayOffline={!isOnline}
      title="SmartStarter journey"
      subTitle={`${practitionerFirstName} ${practitioner?.user?.surname}`}
      onBack={() => history.goBack()}
      className="p-4"
    >
      <StackedList isFullHeight={false} type="MenuList" listItems={visits} />
      <Alert
        className="mt-4"
        type="success"
        title={MOCKED_DATA.alert.title}
        message={MOCKED_DATA.alert.subTitle}
        messageColor="textMid"
        customIcon={<BalloonsIcon />}
      />
      <Typography
        className="mt-4 mb-2"
        type="h4"
        text={`${practitionerFirstName} has been a SmartStarter for`}
      />
      <div className="mb-4 flex gap-2">
        <p className="bg-primary text-14 w-fit w-auto rounded-2xl py-1 px-2 font-semibold text-white">
          {'tag'}
        </p>
        <Typography type="body" color="textMid" text={`Since xx xxx xxxx`} />
      </div>
      <Button
        className="mb-4 w-full"
        color="primary"
        type="outlined"
        textColor="primary"
        icon="LocationMarkerIcon"
        text="Schedule support visit"
      />
      <Steps
        items={MOCKED_DATA.steps}
        typeColor={{ completed: 'successMain' }}
      />
    </BannerWrapper>
  );
};
