import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  ActionModal,
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  TabItem,
  TabList,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { getMotherById } from '@/store/mother/mother.selectors';
import { RootState } from '@/store/types';
import ROUTES from '@/routes/routes';

import { PregnantProfileRouteState } from './index.types';
import { ProgressTab } from './progress-tab';
import { Contact } from './contact';
import { useAppDispatch } from '@/store';
import { motherActions, motherThunkActions } from '@/store/mother';
import { Visits } from './visits';
import { useWalkthrough } from '@/context/walkthroughContext';
import Joyride, { Step } from 'react-joyride';
import { contactSteps } from './contact/walkthrough/steps';
import { Tooltip } from '@/components/walkthrough/tooltip';
import { getJoyrideStyles } from '@/components/walkthrough/styles';
import {
  WalkthroughInfoPage,
  WalkthroughInfoPageProps,
} from '@/components/walkthrough/info-page';
import { visitSteps } from './visits/walkthrough/steps';
import {
  Document,
  MotherDto,
  getStringFromClassNameOrId,
  replaceBraces,
  useDialog,
  usePrevious,
} from '@ecdlink/core';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as AwardIcon } from '@/assets/awardIcon.svg';
import { progressSteps } from './progress-tab/walkthrough/steps';
import { ReferralsTab } from './referrals-tab';
import { referralsSteps } from './referrals-tab/walkthrough/steps';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import {
  documentActions,
  documentSelectors,
  documentThunkActions,
} from '@/store/document';
import { Header } from './components';
import Pregnant from '@/assets/pregnant.svg';
import { add, format } from 'date-fns';
import { useWindowSize } from '@reach/window-size';
import { PregnantMaternalCaseRecord } from '../components/pregnant-maternal-record/pregnant-maternal-record';
import { useStaticData } from '@/hooks/useStaticData';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { newGuid } from '@/utils/common/uuid.utils';
import { userSelectors } from '@/store/user';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { DocumentActions } from '@/store/document/document.actions';
import { PregnantMaternalCaseRecordModel } from '@/schemas/pregnant/pregnant-maternal-case-record';

const HEADER_HEIGHT = 148;

export const PREGNANT_PROFILE_TABS = {
  VISITS: 0,
  PROGRESS: 1,
  REFERRALS: 2,
  CONTACT: 3,
};

export const PregnantProfile: React.FC = () => {
  const [isInfoPage, setIsInfoPage] = useState(false);
  const [isAddMaternalCaseRecord, setIsAddMaternalCaseRecord] = useState(false);

  const { height } = useWindowSize();

  const {
    handleCallback,
    walkthroughDispatch,
    walkthroughState,
    walkthroughStepIndex,
    setIsWalkthroughSession,
  } = useWalkthrough();

  const { state } = useLocation<PregnantProfileRouteState>();

  const previousActiveTab = usePrevious(state?.activeTabIndex);

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const history = useHistory();

  const location = useLocation();

  const [, , , motherId] = location.pathname.split('/');

  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();

  const { isLoading } = useThunkFetchCall(
    'documents',
    DocumentActions.CREATE_DOCUMENT
  );

  const user = useSelector(userSelectors.getUser);

  const documents = useSelector(
    documentSelectors.getDocumentsByUserId(motherId)
  );

  const maternalCaseRecord = documents?.find(
    (item) =>
      item.documentType?.name === 'MaternalCaseRecord' ||
      item.fileType === FileTypeEnum.MaternalCaseRecord
  );

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const isLargeName =
    (mother?.user?.firstName || '').length +
      (mother?.user?.surname || '').length >
    22;

  const tabItems: TabItem[] = useMemo(
    () => [
      {
        title: 'Visits',
        index: PREGNANT_PROFILE_TABS.VISITS,
        initActive: true,
        child: <Visits />,
      },
      {
        title: 'Progress',
        index: PREGNANT_PROFILE_TABS.PROGRESS,
        initActive: false,
        child: <ProgressTab />,
      },
      {
        title: 'Referrals',
        initActive: false,
        child: <ReferralsTab />,
        index: PREGNANT_PROFILE_TABS.REFERRALS,
      },
      {
        title: 'Contact',
        index: PREGNANT_PROFILE_TABS.CONTACT,
        initActive: false,
        child: <Contact />,
      },
    ],
    []
  );

  const {
    steps,
    infoPageSection,
    infoPageTitle,
    hideJoyRideBorders,
    displayExtraComponent,
  } = useMemo((): {
    steps: Step[];
    infoPageTitle: string;
    infoPageSection: WalkthroughInfoPageProps['sectionName'];
    hideJoyRideBorders?: boolean;
    displayExtraComponent?: boolean;
  } => {
    switch (state?.activeTabIndex ?? 0) {
      case PREGNANT_PROFILE_TABS.CONTACT:
        return {
          steps: contactSteps,
          infoPageTitle: 'Contact',
          infoPageSection: 'contact tab',
          hideJoyRideBorders: walkthroughStepIndex === 3,
        };
      case PREGNANT_PROFILE_TABS.PROGRESS:
        return {
          steps: progressSteps,
          infoPageTitle: 'Client progress summary',
          infoPageSection: 'progress tab',
          hideJoyRideBorders: walkthroughStepIndex === 2,
        };
      case PREGNANT_PROFILE_TABS.REFERRALS:
        return {
          steps: referralsSteps,
          infoPageTitle: 'Referrals',
          infoPageSection: 'referrals tab',
          hideJoyRideBorders: walkthroughStepIndex === 3,
        };
      default:
        return {
          steps: visitSteps,
          infoPageSection: 'mom visit tab',
          infoPageTitle: 'Pregnant mom client visits',
          hideJoyRideBorders: walkthroughStepIndex === 3,
          displayExtraComponent: true,
        };
    }
  }, [state?.activeTabIndex, walkthroughStepIndex]);

  const onHelp = useCallback(() => {
    setIsInfoPage(false);
    setIsWalkthroughSession('true');
    walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true });
    setTimeout(
      () => walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: true }),
      200
    );
  }, [setIsWalkthroughSession, walkthroughDispatch]);

  const updateClickedTab = useCallback(() => {
    let input: MotherDto = {
      clickedProgressTab: mother?.clickedProgressTab,
      clickedContactTab: mother?.clickedContactTab,
      clickedReferralsTab: mother?.clickedReferralsTab,
      clickedVisitTab: mother?.clickedVisitTab,
    };

    switch (state?.activeTabIndex) {
      case PREGNANT_PROFILE_TABS.PROGRESS:
        input = {
          ...input,
          clickedProgressTab: true,
        };
        break;
      case PREGNANT_PROFILE_TABS.REFERRALS:
        input = {
          ...input,
          clickedReferralsTab: true,
        };
        break;
      case PREGNANT_PROFILE_TABS.CONTACT:
        input = {
          ...input,
          clickedContactTab: true,
        };
        break;
      default:
        input = {
          ...input,
          clickedVisitTab: true,
        };
        break;
    }

    appDispatch(
      motherThunkActions.updateMother({ mother: input, id: motherId })
    );
  }, [appDispatch, mother, motherId, state?.activeTabIndex]);

  const handleWelcomeDialog = useCallback(() => {
    const currentTab = state?.activeTabIndex ?? 0;
    if (
      (currentTab === PREGNANT_PROFILE_TABS.VISITS &&
        !mother?.clickedVisitTab) ||
      (currentTab === PREGNANT_PROFILE_TABS.PROGRESS &&
        !mother?.clickedProgressTab) ||
      (currentTab === PREGNANT_PROFILE_TABS.REFERRALS &&
        !mother?.clickedReferralsTab) ||
      (currentTab === PREGNANT_PROFILE_TABS.CONTACT &&
        !mother?.clickedContactTab)
    ) {
      let tabName = '';

      switch (currentTab) {
        case PREGNANT_PROFILE_TABS.PROGRESS:
          tabName = 'progress';
          break;
        case PREGNANT_PROFILE_TABS.REFERRALS:
          tabName = 'referrals';
          break;
        case PREGNANT_PROFILE_TABS.CONTACT:
          tabName = 'contact';
          break;

        default:
          tabName = 'visits';
          break;
      }

      return dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render(onClose) {
          return (
            <ActionModal
              customIcon={<PollyNeutral className="mb-3 h-24 w-24" />}
              title={` Welcome to the ${tabName} tab!`}
              detailText="Can I show you how this works?"
              actionButtons={[
                {
                  colour: 'primary',
                  text: 'Yes, help me!',
                  textColour: 'white',
                  type: 'filled',
                  leadingIcon: 'CheckCircleIcon',
                  onClick: () => {
                    updateClickedTab();
                    setIsWalkthroughSession('true');
                    onHelp();
                    onClose();
                  },
                },
                {
                  colour: 'primary',
                  text: 'No, skip',
                  textColour: 'primary',
                  type: 'outlined',
                  leadingIcon: 'ClockIcon',
                  onClick: () => {
                    updateClickedTab();
                    onClose();
                  },
                },
              ]}
            />
          );
        },
      });
    }
  }, [
    dialog,
    mother,
    onHelp,
    setIsWalkthroughSession,
    state?.activeTabIndex,
    updateClickedTab,
  ]);

  const goBack = useCallback(() => {
    if (isAddMaternalCaseRecord) {
      return setIsAddMaternalCaseRecord(false);
    }

    if (isInfoPage) {
      return setIsInfoPage(false);
    }

    return history.push(ROUTES.CLIENTS.ROOT);
  }, [history, isAddMaternalCaseRecord, isInfoPage]);

  const onSubmit = useCallback(
    async (data: PregnantMaternalCaseRecordModel) => {
      const fileName = 'maternalcaserecord.png';
      const workflowStatusId = getWorkflowStatusIdByEnum(
        WorkflowStatusEnum.DocumentPendingVerification
      );
      const documentTypeId = getDocumentTypeIdByEnum(
        FileTypeEnum.MaternalCaseRecord
      );

      const documentInputModel: Document = {
        id: newGuid(),
        userId: motherId,
        createdUserId: user?.id ?? '',
        workflowStatusId: workflowStatusId ?? '',
        documentTypeId: documentTypeId ?? '',
        name: fileName,
        fileName: fileName,
        file: data?.maternalCaseRecord,
        fileType: FileTypeEnum.MaternalCaseRecord,
      };

      const deliveryDatePayload = {
        id: motherId,
        expectedDateOfDelivery: format(data?.deliveryDate!, 'yyyy-MM-dd'),
      };

      appDispatch(motherActions.updateMotherDeliveryDate(deliveryDatePayload));
      await appDispatch(
        motherThunkActions.updateMotherDeliveryDate(deliveryDatePayload)
      );
      appDispatch(documentActions.createDocument(documentInputModel));
      await appDispatch(
        documentThunkActions.createDocument(documentInputModel)
      ).unwrap();

      goBack();
    },
    [
      appDispatch,
      getDocumentTypeIdByEnum,
      getWorkflowStatusIdByEnum,
      goBack,
      motherId,
      user?.id,
    ]
  );

  const renderHeader = useMemo(() => {
    if (isInfoPage) {
      return infoPageTitle;
    }
    return `${mother?.user?.firstName || ''} ${
      !isLargeName ? mother?.user?.surname || '' : ''
    }'s profile`;
  }, [
    infoPageTitle,
    isInfoPage,
    isLargeName,
    mother?.user?.firstName,
    mother?.user?.surname,
  ]);

  const renderContent = useMemo(() => {
    if (isAddMaternalCaseRecord) {
      return (
        <div className="mx-4">
          <PregnantMaternalCaseRecord
            isFromClientProfile
            details={{ name: mother?.user?.firstName }}
            onSubmit={onSubmit}
          />
        </div>
      );
    }

    if (!maternalCaseRecord) {
      const dueDate =
        mother?.expectedDateOfDelivery &&
        add(new Date(mother?.expectedDateOfDelivery), { days: 60 });

      return (
        <>
          <Header
            customIcon={Pregnant}
            backgroundColor="tertiary"
            title={mother?.user?.firstName || ''}
            subTitle="Expected delivery date not added"
          />
          <div
            className="flex flex-col px-4 py-5"
            style={{ height: height - HEADER_HEIGHT }}
          >
            <Alert
              type="error"
              title={`Add a maternal case record for ${
                mother?.user?.firstName || 'mother'
              } before you can start visiting the client.`}
              list={[
                `Encourage ${
                  mother?.user?.firstName || 'mother'
                } to go to the clinic to book the pregnancy and get the maternal case record.`,
                `This profile will be removed if the maternal case record is not uploaded by ${dueDate?.toLocaleString(
                  'en-ZA',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}.`,
              ]}
              className="mt-2"
            />
            <Button
              icon="DocumentAddIcon"
              textColor="white"
              text="Add maternal case record"
              type="filled"
              color="primary"
              className="mt-auto"
              isLoading={isLoading}
              disabled={isLoading}
              onClick={() => setIsAddMaternalCaseRecord(true)}
            />
          </div>
        </>
      );
    }

    return isInfoPage ? (
      <WalkthroughInfoPage
        sectionName={infoPageSection}
        onHelp={onHelp}
        onClose={goBack}
        extraElement={
          displayExtraComponent ? (
            <SuccessCard
              className="my-4"
              customIcon={<AwardIcon className="h-14	w-14" />}
              text={`You can earn points with every visit!`}
              textColour="successDark"
              color="successBg"
            />
          ) : (
            <></>
          )
        }
      />
    ) : (
      <TabList
        id={getStringFromClassNameOrId(visitSteps[0].target)}
        tabClassName="min-w-0 w-24"
        className="bg-uiBg border-uiLight fixed z-20 w-full border-b"
        tabItems={tabItems}
        setSelectedIndex={state?.activeTabIndex ?? 0}
        tabSelected={(tab) =>
          history.push(location.pathname, { activeTabIndex: tab.index })
        }
      />
    );
  }, [
    isAddMaternalCaseRecord,
    maternalCaseRecord,
    isInfoPage,
    infoPageSection,
    onHelp,
    goBack,
    displayExtraComponent,
    tabItems,
    state?.activeTabIndex,
    mother,
    onSubmit,
    height,
    isLoading,
    history,
    location.pathname,
  ]);

  useLayoutEffect(() => {
    (async () =>
      appDispatch(motherThunkActions.getMotherVisits({ motherId })).unwrap())();
  }, [appDispatch, motherId]);

  useEffect(() => {
    if (previousActiveTab !== state?.activeTabIndex && !!maternalCaseRecord) {
      handleWelcomeDialog();
    }
  }, [
    handleWelcomeDialog,
    maternalCaseRecord,
    previousActiveTab,
    state?.activeTabIndex,
  ]);

  return (
    <>
      <Joyride
        steps={steps.map((item) => ({
          ...item,
          content: replaceBraces(
            String(item?.content),
            mother?.user?.firstName || ''
          ),
        }))}
        run={walkthroughState?.isTourActive}
        stepIndex={walkthroughStepIndex}
        callback={handleCallback}
        continuous={true}
        tooltipComponent={({ ...props }) => (
          <Tooltip
            {...props}
            pollyInformationalSteps={[0, 2]}
            pollyNeutralSteps={[1]}
            pollyImpressedSteps={[3]}
            displayCloseButton={props.index < props.size - 1}
          />
        )}
        styles={getJoyrideStyles(hideJoyRideBorders)}
      />
      <BannerWrapper
        size="medium"
        renderBorder
        onBack={goBack}
        title={renderHeader}
        subTitle={
          isAddMaternalCaseRecord
            ? `${mother?.user?.firstName || ''} ${
                !isLargeName ? mother?.user?.surname || '' : ''
              }`
            : ''
        }
        backgroundColour="white"
        displayOffline={!isOnline}
        displayHelp={!isInfoPage && !!maternalCaseRecord}
        onHelp={() => setIsInfoPage(true)}
      >
        {renderContent}
        <div id="walkthrough-last-step" className="w-full"></div>
      </BannerWrapper>
    </>
  );
};
