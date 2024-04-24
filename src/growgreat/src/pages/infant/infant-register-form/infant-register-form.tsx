import {
  BannerWrapper,
  Card,
  Typography,
  Button,
  DialogPosition,
  ActionModal,
} from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ROUTES from '@routes/routes';
import {
  InfantRegisterSteps,
  MultipleChildrenProps,
} from './infant-register-form.types';
import { ConsentAgreement } from '../components/consent-agrement/consent-agreement';
import {
  MotherDetails,
  MOTHER_TYPE_ID,
} from '../components/mother-details/mother-details';
import { MotherContactInformation } from '../components/mother-contact-information/mother-contact-information';
import { InfantAddress } from '../components/infant-address/infant-address';
import { InfantRoadToHealth } from '../components/infant-road-to-health/infant-road-to-health';
import { InfantDetails } from '../components/infantDetails/infant-details';
import { InfantDetailsModel } from '@/schemas/infant/infant-details';
import { InfantRoadToHealthModel } from '@/schemas/infant/infant-road-to-health';
import { MothertContactInformationModel } from '@/schemas/infant/mother-contact-information';
import { newGuid } from '@utils/common/uuid.utils';
import {
  Document,
  CaregiverDto,
  InfantDto,
  SiteAddressDto,
  UserDto,
  useDialog,
  getPreviousAndNextMonths,
  MotherDto,
} from '@ecdlink/core/lib';
import { EditConsentAgreementProps } from '../components/consent-agrement/consent-agreement.types';
import { infantActions, infantThunkActions } from '@/store/infant';
import momImage from '@/assets/happyMom.svg';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';
import {
  caregiverActions,
  caregiverSelectors,
  caregiverThunkActions,
} from '@/store/caregiver';
import { MotherDetailsProps } from '../components/mother-details/mother-details.types';
import { useStaticData } from '@/hooks/useStaticData';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { documentActions, documentThunkActions } from '@/store/document';
import { useWindowSize } from '@reach/window-size';
import { MotherDetailsModel } from '@/schemas/infant/mother-details';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { usePrevious } from '@ecdlink/core/lib/hooks/usePrevious';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { InfantActions } from '@/store/infant/infant.actions';
import { InfantRouteState } from '../infant.types';
import { motherSelectors } from '@/store/mother';
import { RootState } from '@/store/types';
import { eventRecordThunkActions } from '@/store/eventRecord';
import { EventRecordActions } from '@/store/eventRecord/eventRecord.actions';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { PregnantProfileRouteState } from '@/pages/mom/pregnant-profile/index.types';
import { CLIENT_TABS } from '../../client/client-dashboard/class-dashboard';
import { Message } from '@models/messages/messages';
import { NotificationPriority } from '../../../services/NotificationService/NotificationService.types';
import { notificationActions } from '@/store/notifications';

const BANNER_HEIGHT = 64;

interface onSubmit {
  caregiverDetails?: MotherDetailsModel;
  caregiverAddress?: string;
}

export const InfantRegisterForm: React.FC = () => {
  const [label, setLabel] = useState('');
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const user = useSelector(userSelectors.getUser);
  const [hasConsent, setHasConsent] = useState<EditConsentAgreementProps>();
  const [details, setDetails] = useState<MotherDetailsProps>();
  const [infantDetails, setInfantDetails] = useState<InfantDetailsModel>();
  const [infantRoadToHealthBook, setInfantRoadToHealthBook] =
    useState<InfantRoadToHealthModel>();
  const [contactInformation, setContactInformation] =
    useState<MothertContactInformationModel>();
  const [address, setAddress] = useState<string>();
  const [isAlreadyClient, setIsAlreadyClient] = useState<any>(null);
  const [multipleChildren, setMultipleChildren] = useState<
    boolean | undefined
  >();
  const [activeStep, setActiveStep] = useState(
    InfantRegisterSteps.consentAgreement
  );
  const [multipleChildrenArray, setMultipleChildrenArray] = useState<
    MultipleChildrenProps[]
  >([]);
  let numberOfChildren: number | undefined = hasConsent?.numberOfChildren;
  const [multipleChildrenCount, setMultipleChildrenCount] = useState<number>(1);
  const [relationshipId, setRelationshipId] = useState<string | undefined>();

  const [firstChild] = multipleChildrenArray;

  const { height } = useWindowSize();

  const location = useLocation<InfantRouteState & PregnantProfileRouteState>();
  const motherId = location.state?.motherId;
  const infantId = location.state.linkedInfantId;
  const isInfantEvent = !!location.state.isInfantEvent;
  const bornEventId = location.state?.bornEventId;

  const mother = useSelector((state: RootState) => {
    if (!!motherId || (isAlreadyClient && firstChild?.caregiver?.id)) {
      return motherSelectors.getMotherById(
        state,
        motherId || String(firstChild.caregiver?.id)
      );
    }

    return {};
  });
  const caregiver = useSelector(
    caregiverSelectors.getCaregiverById(motherId || '')
  );

  const dialog = useDialog();

  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();

  const healthCareWorker = useSelector(
    healthCareWorkerSelectors.getHealthCareWorker
  );

  const { isLoading, isFulfilled } = useThunkFetchCall(
    'infants',
    InfantActions.ADD_INFANTS
  );
  const { isRejected: isRejectInfantCount } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANT_COUNT_FOR_MONTH
  );

  const { isLoading: isLoadingEventRecord, isRejected: isRejectedEventRecord } =
    useThunkFetchCall('eventRecord', EventRecordActions.ADD_EVENT_RECORD);

  const wasLoading = usePrevious(isLoading);
  const wasLoadingEventRecord = usePrevious(isLoadingEventRecord);

  const { errorDialog } = useRequestResponseDialog();

  const caregiverInfoFromRecordEvent = useMemo(() => {
    if (isInfantEvent) {
      return caregiver || mother;
    }

    if (motherId) {
      return mother;
    }

    return undefined;
  }, [caregiver, isInfantEvent, mother, motherId]) as
    | (MotherDto & CaregiverDto)
    | undefined;

  const successMessage = useMemo(
    () =>
      multipleChildrenArray.length > 1
        ? multipleChildrenArray.length + ' children.'
        : '1 child.',
    [multipleChildrenArray.length]
  );

  useEffect(() => {
    setLabel('step 1 of 6');
  }, []);

  useEffect(() => {
    if (infantRoadToHealthBook) {
      const multipleChildrenRecords = {
        ...infantDetails,
        ...infantRoadToHealthBook,
      };
      if (numberOfChildren && numberOfChildren > 1) {
        setMultipleChildrenArray([
          ...multipleChildrenArray,
          multipleChildrenRecords,
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infantRoadToHealthBook]);

  const completeAllSteps = useCallback(
    async ({ caregiverDetails, caregiverAddress }: onSubmit) => {
      const newCaregiverId = newGuid();
      const siteAddressId = newGuid();

      const siteAddress: SiteAddressDto = {
        id: siteAddressId,
        addressLine1: address || caregiverAddress || '',
      };

      const caregiverInput: CaregiverDto = {
        id:
          firstChild?.caregiver?.id ||
          caregiverDetails?.id ||
          details?.id ||
          newCaregiverId,
        firstName: caregiverDetails?.name || details?.name || '',
        surname: caregiverDetails?.surname || details?.surname || '',
        phoneNumber: contactInformation?.cellphone ?? '',
        whatsAppNumber:
          contactInformation?.whatsapp || contactInformation?.cellphone,
        age: caregiverDetails?.age || details?.age || '',
        siteAddress: siteAddress,
        isActive: true,
        relationId:
          caregiverDetails?.relationshipId ||
          firstChild?.relationshipId ||
          details?.relationshipId ||
          '',
        healthCareWorkerId: user?.id, // Pretty sure this should not be a userId, but the healthCareWorkerId
      };

      setRelationshipId(
        caregiverDetails?.relationshipId ||
          firstChild?.relationshipId ||
          details?.relationshipId
      );

      if (!details?.isMother) {
        appDispatch(caregiverActions.createCaregiver(caregiverInput));
      }
      const healthCareWorkerId = user?.id;

      if (multipleChildrenArray?.length >= 1) {
        for (const child of multipleChildrenArray) {
          let weightAtBirth = undefined;
          let lengthAtBirth = undefined;
          if (child?.roadToHealthBook) {
            weightAtBirth =
              (child?.weightAtBirth && +child?.weightAtBirth) ?? 0;
            lengthAtBirth =
              (child?.lengthAtBirth && +child?.lengthAtBirth) ?? 0;
          }

          const childUserId = newGuid();

          const userInput: UserDto = {
            phoneNumber: contactInformation?.cellphone ?? '',
            firstName: caregiverDetails?.name || details?.name || '',
            surname: caregiverDetails?.surname || details?.surname || '',
            dateOfBirth: infantDetails?.dateOfBirth?.toISOString(),
          };

          const infantInputModel: InfantDto = {
            dateOfBirth: child?.dateOfBirth?.toISOString(),
            firstName: child?.firstName,
            documents: child?.roadToHealthBook,
            userId: childUserId ?? '',
            user: userInput,
            weightAtBirth: weightAtBirth,
            lengthAtBirth: lengthAtBirth,
            genderId: child?.genderId ?? '',
            caregiverId: caregiverInput.id,
            caregiver: caregiverInput,
          };

          appDispatch(infantActions.addInfant(infantInputModel));
          await appDispatch(
            infantThunkActions.addInfant({ infant: infantInputModel, motherId })
          ).unwrap();

          if (infantRoadToHealthBook?.roadToHealthBook) {
            const fileName = 'roadtohealthbook.png';
            const workflowStatusId = getWorkflowStatusIdByEnum(
              WorkflowStatusEnum.DocumentPendingVerification
            );
            const documentTypeId = getDocumentTypeIdByEnum(
              FileTypeEnum.RoadToHealthBook
            );
            const documentInputModel: Document = {
              id: newGuid(),
              userId: childUserId,
              createdUserId: healthCareWorkerId ?? '',
              workflowStatusId: workflowStatusId ?? '',
              documentTypeId: documentTypeId ?? '',
              name: fileName,
              fileName: fileName,
              file: infantRoadToHealthBook?.roadToHealthBook,
              fileType: FileTypeEnum.RoadToHealthBook,
            };

            appDispatch(documentActions.createDocument(documentInputModel));
            await appDispatch(
              documentThunkActions.createDocument(documentInputModel)
            ).unwrap();
          }
        }
      } else {
        let weightAtBirth = undefined;
        let lengthAtBirth = undefined;
        if (!infantRoadToHealthBook?.notRoadToHealthBook) {
          weightAtBirth =
            (infantRoadToHealthBook?.weightAtBirth &&
              +infantRoadToHealthBook?.weightAtBirth) ??
            0;
          lengthAtBirth =
            (infantRoadToHealthBook?.lengthAtBirth &&
              +infantRoadToHealthBook?.lengthAtBirth) ??
            0;
        }

        const childUserId = newGuid();
        const user: UserDto = {
          phoneNumber: contactInformation?.cellphone ?? '',
          firstName: caregiverDetails?.name || details?.name || '',
          surname: caregiverDetails?.surname || details?.surname || '',
          dateOfBirth: infantDetails?.dateOfBirth?.toISOString(),
        };

        const infantInputModel: InfantDto = {
          dateOfBirth: infantDetails?.dateOfBirth?.toISOString(),
          firstName: infantDetails?.firstName,
          genderId: infantDetails?.genderId,
          documents: infantRoadToHealthBook?.roadToHealthBook,
          userId: childUserId ?? '',
          user: user,
          weightAtBirth: weightAtBirth,
          lengthAtBirth: lengthAtBirth,
          caregiverId: caregiverInput.id,
          caregiver: caregiverInput,
        };

        appDispatch(infantActions.addInfant(infantInputModel));
        await appDispatch(
          infantThunkActions.addInfant({ infant: infantInputModel, motherId })
        ).unwrap();

        if (infantRoadToHealthBook?.roadToHealthBook) {
          const fileName = 'roadtohealthbook.png';
          const workflowStatusId = getWorkflowStatusIdByEnum(
            WorkflowStatusEnum.DocumentPendingVerification
          );
          const documentTypeId = getDocumentTypeIdByEnum(
            FileTypeEnum.RoadToHealthBook
          );
          const documentInputModel: Document = {
            id: newGuid(),
            userId: childUserId,
            createdUserId: healthCareWorkerId ?? '',
            workflowStatusId: workflowStatusId ?? '',
            documentTypeId: documentTypeId ?? '',
            name: fileName,
            fileName: fileName,
            file: infantRoadToHealthBook?.roadToHealthBook,
            fileType: FileTypeEnum.RoadToHealthBook,
          };

          appDispatch(documentActions.createDocument(documentInputModel));
          await appDispatch(
            documentThunkActions.createDocument(documentInputModel)
          ).unwrap();
        } else {
          const notification: Message = {
            reference: `${childUserId}-docs`,
            title: `Upload ${infantDetails?.firstName}'s Road to Health Book`,
            message: `Add a picture of page ii of ${infantDetails?.firstName}'s Road to Health Book. Refer ${caregiverInput?.firstName} to the clinic if they do not have
          ${infantDetails?.firstName}'s document.`,
            dateCreated: new Date().toISOString(),
            priority: NotificationPriority.higher,
            viewOnDashboard: true,
            area: 'child-registration',
            icon: 'IdentificationIcon',
            color: 'primary',
            actionText: 'Upload image of RTH',
            viewType: 'Both',
            cta: 'RoadToHealth',
            routeConfig: {
              route: `${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}${childUserId}`,
              params: {
                isRoadToHealthBook: true,
              },
            },
          };
          appDispatch(notificationActions.addNotification(notification));
        }
      }
    },
    [
      address,
      appDispatch,
      contactInformation?.cellphone,
      contactInformation?.whatsapp,
      details?.age,
      details?.id,
      details?.isMother,
      details?.name,
      details?.relationshipId,
      details?.surname,
      firstChild?.caregiver?.id,
      firstChild?.relationshipId,
      getDocumentTypeIdByEnum,
      getWorkflowStatusIdByEnum,
      infantDetails?.dateOfBirth,
      infantDetails?.firstName,
      infantDetails?.genderId,
      infantRoadToHealthBook?.lengthAtBirth,
      infantRoadToHealthBook?.notRoadToHealthBook,
      infantRoadToHealthBook?.roadToHealthBook,
      infantRoadToHealthBook?.weightAtBirth,
      motherId,
      multipleChildrenArray,
      user?.id,
    ]
  );

  const handleExistingUser = useCallback(
    ({ caregiverDetails }: onSubmit) => {
      if (isAlreadyClient) {
        completeAllSteps({ caregiverDetails });
        return;
      }
      setActiveStep(InfantRegisterSteps.pregnantContactInformation);
    },
    [completeAllSteps, isAlreadyClient]
  );

  const handleMultipleChildrenSteps = useCallback(() => {
    if (multipleChildrenCount < Number(numberOfChildren)) {
      setActiveStep(InfantRegisterSteps.infantDetails);
      setMultipleChildrenCount(multipleChildrenCount + 1);
      setLabel(`step 2 of 6`);
      return;
    }
    setLabel(`step 4 of 6`);
    setActiveStep(InfantRegisterSteps.motherDetails);
  }, [multipleChildrenCount, numberOfChildren]);

  const steps = useCallback(
    (step: InfantRegisterSteps) => {
      switch (step) {
        case InfantRegisterSteps.infantDetails:
          return (
            <InfantDetails
              multipleChildrenCount={multipleChildrenCount}
              numberOfChildren={numberOfChildren}
              motherInfo={caregiverInfoFromRecordEvent}
              name={infantDetails?.firstName}
              dateOfBirth={infantDetails?.dateOfBirth}
              genderId={infantDetails?.genderId}
              onSubmit={(value) => {
                setLabel(`step 3 of 6`);
                setInfantDetails(value);
                setActiveStep(InfantRegisterSteps.infantRoadToHealth);
              }}
            />
          );
        case InfantRegisterSteps.infantRoadToHealth:
          return (
            <InfantRoadToHealth
              infantDetails={infantDetails}
              weightAtBirth={infantRoadToHealthBook?.weightAtBirth}
              lengthAtBirth={infantRoadToHealthBook?.lengthAtBirth}
              roadToHealthBook={infantRoadToHealthBook?.roadToHealthBook}
              onSubmit={(value) => {
                handleMultipleChildrenSteps();
                setInfantRoadToHealthBook(value);
              }}
            />
          );
        case InfantRegisterSteps.motherDetails:
          return (
            <MotherDetails
              setMultipleChildrenArray={setMultipleChildrenArray}
              multipleChildrenArray={multipleChildrenArray}
              infantDetails={infantDetails}
              setContactInformation={setContactInformation}
              setAddress={setAddress}
              setIsAlreadyClient={setIsAlreadyClient}
              isAlreadyClient={isAlreadyClient}
              motherInfo={caregiverInfoFromRecordEvent}
              onSubmit={(value) => {
                setDetails(value as any);
                handleExistingUser({ caregiverDetails: value });

                if (isAlreadyClient) {
                  return setLabel(`step 4 of 4`);
                }

                return setLabel(`step 5 of 6`);
              }}
            />
          );
        case InfantRegisterSteps.pregnantContactInformation:
          return (
            <MotherContactInformation
              details={details}
              onSubmit={(value) => {
                setLabel(`step 6 of 6`);
                setActiveStep(InfantRegisterSteps.pregnantAddress);
                setContactInformation(value);
              }}
            />
          );
        case InfantRegisterSteps.pregnantAddress:
          return (
            <InfantAddress
              details={details}
              infantDetails={infantDetails}
              onSubmit={(value) => {
                setLabel(`step 6 of 6`);
                setAddress(value.address);
                completeAllSteps({ caregiverAddress: value.address });
              }}
            />
          );
        case InfantRegisterSteps.consentAgreement:
        default:
          return (
            <ConsentAgreement
              multipleChildren={multipleChildren}
              setMultipleChildren={setMultipleChildren}
              onSubmit={(value) => {
                setActiveStep(InfantRegisterSteps.infantDetails);
                setHasConsent(value as any);
                setLabel(`step 2 of 6`);
              }}
            />
          );
      }
    },
    [
      caregiverInfoFromRecordEvent,
      completeAllSteps,
      details,
      handleExistingUser,
      handleMultipleChildrenSteps,
      infantDetails,
      infantRoadToHealthBook?.lengthAtBirth,
      infantRoadToHealthBook?.roadToHealthBook,
      infantRoadToHealthBook?.weightAtBirth,
      isAlreadyClient,
      multipleChildren,
      multipleChildrenArray,
      multipleChildrenCount,
      numberOfChildren,
    ]
  );

  const showSuccessMessage = useCallback(
    (count?: number) =>
      dialog({
        position: DialogPosition.Middle,
        color: 'bg-transparent',
        blocking: true,
        render(onSubmit) {
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
                text={
                  !!count && !isRejectInfantCount
                    ? `Great job ${user?.firstName}, you've registered ${count} children this month.`
                    : `Great job ${user?.firstName}, you've registered ${successMessage}`
                }
              />
              <Typography
                className="mt-7"
                color="textDark"
                text={`Keep going!`}
                type="body"
                lineHeight="snug"
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
                    onSubmit();
                  }}
                />
              </div>
            </Card>
          );
        },
      }),
    [dialog, history, isRejectInfantCount, successMessage, user?.firstName]
  );

  const displayRecordEventDialog = useCallback(
    (child: InfantDto) => {
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
              title={`Would you like to record the event: ${mother?.user?.firstName}'s baby was born?`}
              detailText={`${child?.firstName}'s birth date is close to ${mother?.user?.firstName}'s expected delivery date. If ${mother?.user?.firstName} has given birth, record the event!`}
              actionButtons={[
                {
                  colour: 'primary',
                  text: 'Yes, record this event',
                  textColour: 'white',
                  type: 'filled',
                  leadingIcon: 'ClipboardCheckIcon',
                  onClick: () => {
                    history.push(
                      `${ROUTES.CLIENTS.MOM_PROFILE.ROOT}${mother?.user?.id}/record-event`,
                      {
                        isFromInfantForm: true,
                      }
                    );
                    onClose();
                  },
                },
                {
                  colour: 'primary',
                  text: 'No, close',
                  textColour: 'primary',
                  type: 'outlined',
                  leadingIcon: 'XIcon',
                  onClick: () => {
                    history.push(ROUTES.CLIENTS.ROOT);
                    onClose();
                  },
                },
              ]}
            />
          );
        },
      });
    },
    [dialog, history, mother?.user?.firstName, mother?.user?.id]
  );

  const getChildWithCloseBirthday = useCallback(() => {
    if (mother?.user && isAlreadyClient && !!mother?.expectedDateOfDelivery) {
      const { nextDate, previousDate } = getPreviousAndNextMonths(
        mother.expectedDateOfDelivery,
        2
      );
      const child = multipleChildrenArray.find((child) => {
        const childBirthday = child.dateOfBirth && new Date(child.dateOfBirth);

        return (
          childBirthday &&
          childBirthday >= previousDate &&
          childBirthday <= nextDate
        );
      });

      return child;
    }
  }, [isAlreadyClient, mother, multipleChildrenArray]);

  useEffect(() => {
    if (activeStep === InfantRegisterSteps.motherDetails && isAlreadyClient) {
      setLabel('step 4 of 4');
    }

    if (activeStep === InfantRegisterSteps.motherDetails && !isAlreadyClient) {
      setLabel('step 4 of 6');
    }
  }, [activeStep, isAlreadyClient]);

  const getInfantCount = useCallback(async () => {
    const count = await appDispatch(
      infantThunkActions.getInfantCountForMonth({})
    ).unwrap();

    showSuccessMessage(count || undefined);
  }, [appDispatch, showSuccessMessage]);

  const onSuccess = useCallback(() => {
    if (isFulfilled) {
      if (motherId || isInfantEvent) {
        const input = {
          eventRecordTypeId:
            bornEventId || location.state.recordEventInput?.eventRecordTypeId,
          ...(isInfantEvent ? { infantId } : { motherId }),
          notes: location.state.recordEventInput?.notes,
        };

        return appDispatch(
          eventRecordThunkActions.addEventRecord({
            input,
          })
        );
      }

      if (relationshipId === MOTHER_TYPE_ID) {
        const child = getChildWithCloseBirthday();

        if (!!child) {
          return displayRecordEventDialog(child);
        }
      }

      getInfantCount();

      if (healthCareWorker) {
        (async () =>
          await appDispatch(
            caregiverThunkActions.getCaregiversForHealthCareWorker({
              id: healthCareWorker?.id || '',
            })
          ).unwrap())();
      }
    } else {
      showSuccessMessage();
    }
  }, [
    isFulfilled,
    motherId,
    isInfantEvent,
    relationshipId,
    getInfantCount,
    healthCareWorker,
    bornEventId,
    location.state.recordEventInput?.eventRecordTypeId,
    location.state.recordEventInput?.notes,
    infantId,
    appDispatch,
    getChildWithCloseBirthday,
    displayRecordEventDialog,
    showSuccessMessage,
  ]);

  useEffect(() => {
    if (!isLoading && wasLoading) {
      onSuccess();
    }
  }, [isLoading, onSuccess, wasLoading]);

  useEffect(() => {
    if (wasLoadingEventRecord && !isLoadingEventRecord) {
      if (isRejectedEventRecord) {
        errorDialog(
          `The child has been registered, but it was not possible to record the event. Please try to record the event again.`
        );
        return history.push(ROUTES.CLIENTS.ROOT);
      }

      getInfantCount();
    }
  }, [
    errorDialog,
    getInfantCount,
    history,
    isLoadingEventRecord,
    isRejectedEventRecord,
    mother?.user?.firstName,
    wasLoadingEventRecord,
  ]);

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
      case InfantRegisterSteps.infantDetails:
        setLabel(`step 1 of 6`);
        setActiveStep(InfantRegisterSteps.consentAgreement);
        break;
      case InfantRegisterSteps.infantRoadToHealth:
        setLabel(`step 2 of 6`);
        setActiveStep(InfantRegisterSteps.infantDetails);
        break;
      case InfantRegisterSteps.motherDetails:
        setLabel(`step 3 of 6`);
        setActiveStep(InfantRegisterSteps.infantRoadToHealth);
        break;
      case InfantRegisterSteps.pregnantContactInformation:
        setLabel(`step 4 of 6`);
        setActiveStep(InfantRegisterSteps.motherDetails);
        break;
      case InfantRegisterSteps.pregnantAddress:
        setLabel(`step 5 of 6`);
        setActiveStep(InfantRegisterSteps.pregnantContactInformation);
        break;
      case InfantRegisterSteps.consentAgreement:
        handleOnClose();
        break;
      default:
        setActiveStep(InfantRegisterSteps.consentAgreement);
        break;
    }
    return steps(activeStep);
  }, [activeStep, handleOnClose, steps]);

  return (
    <div className="text-textMid">
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={'Child registration'}
        subTitle={label}
        onClose={handleOnClose}
        onBack={handleOnBack}
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div
        className={'flex flex-col overflow-auto px-4 pb-5'}
        style={{ height: height - BANNER_HEIGHT }}
      >
        {steps(activeStep)}
      </div>
    </div>
  );
};
