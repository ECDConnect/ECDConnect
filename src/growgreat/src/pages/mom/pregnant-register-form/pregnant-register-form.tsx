import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  BannerWrapper,
  Card,
  Button,
  Typography,
  DialogPosition,
  ActionModal,
} from '@ecdlink/ui';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import {
  Document,
  MotherDto,
  SiteAddressDto,
  UserDto,
  CaregiverDto,
  useDialog,
  usePrevious,
} from '@ecdlink/core/lib';
import ROUTES from '@/routes/routes';
import momImage from '@/assets/happyMom.svg';
import { newGuid } from '@/utils/common/uuid.utils';
import { useStaticData } from '@/hooks/useStaticData';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useWindowSize } from '@reach/window-size';

import { PregnantAddress } from '@/pages/mom/components/pregnant-address/pregnant-address';
import { ConsentAgreement } from '@/pages/mom/components/consent-agreement/consent-agreement';
import { PregnantDetails } from '@/pages/mom/components/pregnant-details/pregnant-details';
import { ContactInformation } from '@/pages/mom/components/contact-information/contact-information';
import { PregnantMaternalCaseRecord } from '@/pages/mom/components/pregnant-maternal-record/pregnant-maternal-record';
import { EditPregnantDetailsProps } from '@/pages/mom/components/pregnant-details/pregnant-details.types';
import { PregnantAddressProps } from '@/pages/mom/components/pregnant-address/pregnant-address.types';
import { PregnantRegisterSteps } from '@/pages/mom/pregnant-register-form/pregnant-register-form.types';
import { PregnantMaternalCaseRecordProps } from '@/pages/mom/components/pregnant-maternal-record/pregnant-maternal-record.types';
import { EditPregnantContactInformationProps } from '@/pages/mom/components/contact-information/contact-information.types';

import { useAppDispatch } from '@/store';
import { userSelectors } from '@/store/user';
import { caregiverActions } from '@/store/caregiver';
import { staticDataSelectors } from '@/store/static-data';
import { motherActions, motherThunkActions } from '@/store/mother';
import { documentActions, documentThunkActions } from '@/store/document';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { MotherActions } from '@/store/mother/mother.actions';
import { PregnantProfileRouteState } from '../pregnant-profile/index.types';
import { eventRecordThunkActions } from '@/store/eventRecord';
import { EventRecordActions } from '@/store/eventRecord/eventRecord.actions';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { CLIENT_TABS } from '../../client/client-dashboard/class-dashboard';

const BANNER_HEIGHT = 64;

export const PregnantRegisterForm: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const history = useHistory();
  const location = useLocation<PregnantProfileRouteState>();

  const [label, setLabel] = useState('');
  const [details, setDetails] = useState<EditPregnantDetailsProps>();
  const [contactInformation, setContactInformation] =
    useState<EditPregnantContactInformationProps>();
  const [address, setAddress] = useState<PregnantAddressProps>();
  const [isAlreadyClient, setIsAlreadyClient] = useState<any>(null);
  const [pregnantMaternalCaseRecord, setPregnantMaternalCaseRecord] =
    useState<PregnantMaternalCaseRecordProps>();
  const [activeStep, setActiveStep] = useState(
    PregnantRegisterSteps.consentAgreement
  );
  const user = useSelector(userSelectors.getUser);
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();
  const relations = useSelector(staticDataSelectors.getRelations);

  const dialog = useDialog();

  const { height } = useWindowSize();

  const { isLoading, isRejected } = useThunkFetchCall(
    'mothers',
    MotherActions.ADD_MOTHER
  );
  const { isRejected: isRejectedGetMotherCount } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_MOTHER_COUNT_FOR_MONTH
  );
  const { isLoading: isLoadingEventRecord, isRejected: isRejectedEventRecord } =
    useThunkFetchCall('eventRecord', EventRecordActions.ADD_EVENT_RECORD);

  const wasLoading = usePrevious(isLoading);
  const wasLoadingEventRecord = usePrevious(isLoadingEventRecord);

  const { errorDialog } = useRequestResponseDialog();

  const handleExistingUser = () => {
    if (isAlreadyClient) {
      setActiveStep(PregnantRegisterSteps.pregnantMaternalRecord);
      return;
    }
    setActiveStep(PregnantRegisterSteps.pregnantContactInformation);
  };

  useEffect(() => {
    const isOnSubmit = pregnantMaternalCaseRecord?.deliveryDate !== undefined;
    const recordEventInput = location?.state?.recordEventInput;
    if (isOnSubmit && !recordEventInput) {
      completeAllSteps();
    }

    if (isOnSubmit && recordEventInput) {
      if (location?.state?.recordEventInput) {
        appDispatch(
          eventRecordThunkActions.addEventRecord({
            input: location.state.recordEventInput,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pregnantMaternalCaseRecord?.deliveryDate]);

  const completeAllSteps = useCallback(() => {
    const motherId = newGuid();
    const motherUserId = newGuid();
    const siteAddressDto: SiteAddressDto = {
      addressLine1: address?.address || address?.addressLine1 || '',
    };
    const userInput: UserDto = {
      phoneNumber: contactInformation?.cellphone ?? '',
      firstName: details?.name ?? '',
      surname: details?.surname ?? '',
    };
    const motherInputModel: MotherDto = {
      id: motherId,
      userId: motherUserId,
      firstName: details?.name ?? '',
      surname: details?.surname ?? '',
      user: userInput,
      phoneNumber: contactInformation?.cellphone ?? '',
      siteAddress: siteAddressDto,
      siteAddressId: address?.id || address?.address || '',
      healthCareWorkerId: user?.id ?? '',
      age: details?.age,
      expectedDateOfDelivery:
        pregnantMaternalCaseRecord?.notHaveAMaternalRecord === false
          ? pregnantMaternalCaseRecord?.deliveryDate?.toISOString()
          : undefined,
      whatsAppNumber:
        contactInformation?.whatsapp ?? contactInformation?.cellphone,
      ...(!!location?.state?.linkedInfantId
        ? { linkedInfantId: location?.state?.linkedInfantId }
        : {}),
    };
    const caregiverInput: CaregiverDto = {
      firstName: details?.name ?? '',
      surname: details?.surname ?? '',
      phoneNumber: contactInformation?.cellphone ?? '',
      whatsAppNumber:
        contactInformation?.whatsapp ?? contactInformation?.cellphone,
      age: details?.age,
      isActive: true,
      siteAddress: siteAddressDto,
      relationId: relations.find((x) => x.description === 'Mother')?.id,
    };
    appDispatch(caregiverActions.createCaregiver(caregiverInput));
    appDispatch(motherActions.addMother(motherInputModel));
    appDispatch(
      motherThunkActions.addMother({ mother: motherInputModel })
    ).unwrap();

    if (!pregnantMaternalCaseRecord?.notHaveAMaternalRecord) {
      const fileName = 'maternalcaserecord.png';
      const workflowStatusId = getWorkflowStatusIdByEnum(
        WorkflowStatusEnum.DocumentPendingVerification
      );
      const documentTypeId = getDocumentTypeIdByEnum(
        FileTypeEnum.MaternalCaseRecord
      );

      const documentInputModel: Document = {
        id: newGuid(),
        userId: motherUserId,
        createdUserId: user?.id ?? '',
        workflowStatusId: workflowStatusId ?? '',
        documentTypeId: documentTypeId ?? '',
        name: fileName,
        fileName: fileName,
        file: pregnantMaternalCaseRecord?.maternalCaseRecord,
        fileType: FileTypeEnum.MaternalCaseRecord,
      };
      appDispatch(documentActions.createDocument(documentInputModel));
      appDispatch(
        documentThunkActions.createDocument(documentInputModel)
      ).unwrap();
    }
  }, [
    address,
    contactInformation,
    details,
    user?.id,
    pregnantMaternalCaseRecord,
    location?.state?.linkedInfantId,
    relations,
    appDispatch,
    getWorkflowStatusIdByEnum,
    getDocumentTypeIdByEnum,
  ]);

  const steps = useCallback(
    (step: PregnantRegisterSteps) => {
      switch (step) {
        case PregnantRegisterSteps.pregnantDetails:
          return (
            <PregnantDetails
              setContactInformation={setContactInformation}
              setAddress={setAddress}
              setIsAlreadyClient={setIsAlreadyClient}
              isAlreadyClient={isAlreadyClient}
              onSubmit={(value) => {
                setLabel(`step 3 of 5`);
                setDetails(value as EditPregnantDetailsProps);
                handleExistingUser();
              }}
            />
          );
        case PregnantRegisterSteps.pregnantContactInformation:
          return (
            <ContactInformation
              details={details as any}
              onSubmit={(value) => {
                setLabel(`step 4 of 5`);
                setActiveStep(PregnantRegisterSteps.pregnantAddress);
                setContactInformation(
                  value as EditPregnantContactInformationProps
                );
              }}
            />
          );
        case PregnantRegisterSteps.pregnantAddress:
          return (
            <PregnantAddress
              details={details as any}
              onSubmit={(value) => {
                setLabel(`step 5 of 5`);
                setActiveStep(PregnantRegisterSteps.pregnantMaternalRecord);
                setAddress(value as PregnantAddressProps);
              }}
            />
          );
        case PregnantRegisterSteps.pregnantMaternalRecord:
          return (
            <PregnantMaternalCaseRecord
              details={details as any}
              onSubmit={(value) => {
                setLabel(`step 5 of 5`);
                setPregnantMaternalCaseRecord(
                  value as PregnantMaternalCaseRecordProps
                );
              }}
            />
          );
        case PregnantRegisterSteps.consentAgreement:
        default:
          return (
            <ConsentAgreement
              onSubmit={(value) => {
                setActiveStep(PregnantRegisterSteps.pregnantDetails);
                setLabel(`step 2 of 5`);
              }}
            />
          );
      }
    },
    [details, handleExistingUser, isAlreadyClient]
  );

  const handleOnClose = useCallback(() => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            icon="ExclamationCircleIcon"
            iconColor="alertMain"
            iconClassName="h-10 w-10"
            title="Are you sure you want to exit?"
            detailText="If you exit now you will lose your progress."
            actionButtons={[
              {
                colour: 'primary',
                text: 'Exit',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'LoginIcon',
                onClick: () => {
                  history.push(ROUTES.CLIENTS.ROOT, {
                    activeTabIndex: CLIENT_TABS.CLIENT,
                  });
                  onClose();
                },
              },
              {
                colour: 'primary',
                text: 'Continue editing',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'PencilIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  }, [dialog, history]);

  const handleOnBack = useCallback(() => {
    switch (activeStep) {
      case PregnantRegisterSteps.pregnantDetails:
        setLabel(`step 1 of 6`);
        setActiveStep(PregnantRegisterSteps.consentAgreement);
        break;
      case PregnantRegisterSteps.pregnantContactInformation:
        setLabel(`step 2 of 6`);
        setActiveStep(PregnantRegisterSteps.pregnantDetails);
        break;
      case PregnantRegisterSteps.pregnantAddress:
        setLabel(`step 3 of 6`);
        setActiveStep(PregnantRegisterSteps.pregnantContactInformation);
        break;
      case PregnantRegisterSteps.pregnantMaternalRecord:
        setLabel(`step 4 of 6`);
        setActiveStep(PregnantRegisterSteps.pregnantAddress);
        break;
      case PregnantRegisterSteps.consentAgreement:
        handleOnClose();
        break;
      default:
        setActiveStep(PregnantRegisterSteps.consentAgreement);
        break;
    }
    return steps(activeStep);
  }, [activeStep, handleOnClose, steps]);

  useEffect(() => {
    setLabel('step 1 of 5');
  }, []);

  const showSuccessMessage = useCallback(
    (count?: number) =>
      dialog({
        position: DialogPosition.Middle,
        color: 'bg-transparent',
        render(onSubmit, onClose) {
          return (
            <Card
              shadowSize={'lg'}
              borderRaduis={'3xl'}
              className="flex flex-col items-center justify-center px-4 py-6"
            >
              <div className="bg-tertiary flex h-28 w-28 justify-center overflow-hidden rounded-full">
                <img className={'mt-6'} src={momImage} alt="card" />
              </div>
              <Typography
                type="h3"
                weight="bold"
                className="mt-4"
                lineHeight="snug"
                text={'New client registered!'}
              />
              <Typography
                type="body"
                color="textMid"
                className="mt-4 text-center"
                lineHeight="snug"
                text={`Great job ${user?.firstName}, you've registered ${
                  !!count && !isRejectedGetMotherCount
                    ? `${count} pregnant mom this month.`
                    : '1 pregnant mom.'
                }`}
              />
              <div className={'mt-4 flex w-full justify-center'}>
                <Button
                  text={`Close`}
                  icon={'XIcon'}
                  type={'filled'}
                  color={'primary'}
                  textColor={'white'}
                  className={'max-h-10 w-full'}
                  iconPosition={'start'}
                  onClick={() => {
                    history.push(ROUTES.CLIENTS.ROOT, {
                      activeTabIndex: CLIENT_TABS.CLIENT,
                    });
                    onClose();
                  }}
                />
              </div>
            </Card>
          );
        },
      }),
    [dialog, history, isRejectedGetMotherCount, user?.firstName]
  );

  const onSuccess = useCallback(async () => {
    if (!isRejected) {
      const count = await appDispatch(
        motherThunkActions.getMotherCountForMonth()
      ).unwrap();
      showSuccessMessage(count);
    } else {
      showSuccessMessage();
    }
  }, [appDispatch, isRejected, showSuccessMessage]);

  useEffect(() => {
    if (wasLoadingEventRecord && !isLoadingEventRecord) {
      if (isRejectedEventRecord) {
        errorDialog('Could not record the event, please try again');
        return history.push(ROUTES.CLIENTS.ROOT);
      }

      completeAllSteps();
    }
  }, [
    completeAllSteps,
    errorDialog,
    history,
    isLoadingEventRecord,
    isRejectedEventRecord,
    wasLoadingEventRecord,
  ]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      onSuccess();
    }
  }, [isLoading, isRejected, onSuccess, wasLoading]);

  return (
    <div className="text-textMid">
      <BannerWrapper
        size={'normal'}
        subTitle={label}
        renderBorder={true}
        displayOffline={!isOnline}
        onClose={handleOnClose}
        onBack={handleOnBack}
        title={'Pregnant mom registration'}
      />
      <div
        className={'flex flex-col overflow-auto px-4 pb-5'}
        style={{ height: height - BANNER_HEIGHT }}
      >
        {steps(activeStep as PregnantRegisterSteps)}
      </div>
    </div>
  );
};
