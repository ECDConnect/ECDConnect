import {
  BannerWrapper,
  Card,
  Typography,
  Button,
  DialogPosition,
} from '@ecdlink/ui';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { useCallback, useEffect, useState } from 'react';
import ROUTES from '@routes/routes';
import {
  InfantRegisterSteps,
  MultipleChildrenProps,
} from './infant-register-form.types';
import { ConsentAgreement } from '../components/consent-agrement/consent-agreement';
import { MotherDetails } from '../components/mother-details/mother-details';
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
} from '@ecdlink/core/lib';
import { EditConsentAgreementProps } from '../components/consent-agrement/consent-agreement.types';
import { infantActions, infantThunkActions } from '@/store/infant';
import momImage from '@/assets/happyMom.svg';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';
import {
  caregiverActions,
  caregiverThunkActions,
  // caregiverThunkActions
} from '@/store/caregiver';
import { MotherDetailsProps } from '../components/mother-details/mother-details.types';
// import { AddressInfo } from 'net';
// import { InfantAddressProps } from '../components/infant-address/infant-address.types';
import { useStaticData } from '@/hooks/useStaticData';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { documentActions, documentThunkActions } from '@/store/document';
import { useWindowSize } from '@reach/window-size';
import { MotherDetailsModel } from '@/schemas/infant/mother-details';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { usePrevious } from '@/hooks/usePrevious';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';

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
  const [multipleChildren, setMultipleChildren] = useState(false);
  const [activeStep, setActiveStep] = useState(
    InfantRegisterSteps.consentAgreement
  );
  const [multipleChildrenArray, setMultipleChildrenArray] = useState<
    MultipleChildrenProps[]
  >([]);
  let numberOfChildren: number | undefined = hasConsent?.numberOfChildren;
  const [multipleChildrenCount, setMultipleChildrenCount] = useState<number>(1);

  const { height } = useWindowSize();

  const dialog = useDialog();

  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();

  const healthCareWorker = useSelector(
    healthCareWorkerSelectors.getHealthCareWorker
  );

  const { isLoading, isRejected } = useThunkFetchCall('infants');
  const wasLoading = usePrevious(isLoading);

  useEffect(() => {
    setLabel('step 1 of 6');
  }, []);

  // const { data } = useQuery(GenderList, { fetchPolicy: 'cache-and-network' });

  useEffect(() => {
    if (infantRoadToHealthBook) {
      const multipleChildrenRecords = {
        ...infantDetails,
        ...infantRoadToHealthBook,
      };
      setMultipleChildrenArray([
        ...multipleChildrenArray,
        multipleChildrenRecords,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infantRoadToHealthBook]);

  const handleExistingUser = ({ caregiverDetails }: onSubmit) => {
    if (isAlreadyClient) {
      completeAllSteps({ caregiverDetails });
      showSuccessMessage();
      return;
    }
    setActiveStep(InfantRegisterSteps.pregnantContactInformation);
  };

  const handleMultipleChildrenSteps = () => {
    if (multipleChildrenCount < Number(numberOfChildren!)) {
      setActiveStep(InfantRegisterSteps.infantDetails);
      setMultipleChildrenCount(multipleChildrenCount + 1);
      setLabel(`step 2 of 6`);
      return;
    }
    setLabel(`step 4 of 6`);
    setActiveStep(InfantRegisterSteps.motherDetails);
  };

  const completeAllSteps = ({
    caregiverDetails,
    caregiverAddress,
  }: onSubmit) => {
    const newCaregiverId = newGuid();
    const siteAddressId = newGuid();

    const siteAddress: SiteAddressDto = {
      id: siteAddressId,
      addressLine1: address || caregiverAddress || '',
    };

    const [firstChild] = multipleChildrenArray;

    const caregiverInput: CaregiverDto = {
      id:
        firstChild.caregiver?.id ||
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
      healthCareWorkerId: user?.id,
    };
    if (!details?.isMother) {
      appDispatch(caregiverActions.createCaregiver(caregiverInput));
    }

    if (multipleChildrenArray?.length >= 1) {
      for (const child of multipleChildrenArray) {
        let weightAtBirth = undefined;
        let lengthAtBirth = undefined;
        if (child?.roadToHealthBook) {
          weightAtBirth = (child?.weightAtBirth && +child?.weightAtBirth) ?? 0;
          lengthAtBirth = (child?.lengthAtBirth && +child?.lengthAtBirth) ?? 0;
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
        appDispatch(
          infantThunkActions.addInfant({ infant: infantInputModel })
        ).unwrap();

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
          createdUserId: user?.id ?? '',
          workflowStatusId: workflowStatusId ?? '',
          documentTypeId: documentTypeId ?? '',
          name: fileName,
          fileName: fileName,
          file: infantRoadToHealthBook?.roadToHealthBook,
          fileType: FileTypeEnum.RoadToHealthBook,
        };
        appDispatch(documentActions.createDocument(documentInputModel));
        appDispatch(
          documentThunkActions.createDocument(documentInputModel)
        ).unwrap();
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
      appDispatch(
        infantThunkActions.addInfant({ infant: infantInputModel })
      ).unwrap();

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
        createdUserId: user?.id ?? '',
        workflowStatusId: workflowStatusId ?? '',
        documentTypeId: documentTypeId ?? '',
        name: fileName,
        fileName: fileName,
        file: infantRoadToHealthBook?.roadToHealthBook,
        fileType: FileTypeEnum.RoadToHealthBook,
      };
      appDispatch(documentActions.createDocument(documentInputModel));
      appDispatch(
        documentThunkActions.createDocument(documentInputModel)
      ).unwrap();
    }
  };

  const steps = (step: InfantRegisterSteps) => {
    switch (step) {
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
      case InfantRegisterSteps.infantDetails:
        return (
          <InfantDetails
            multipleChildrenCount={multipleChildrenCount}
            numberOfChildren={numberOfChildren}
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
            onSubmit={(value) => {
              handleMultipleChildrenSteps();
              // setActiveStep(InfantRegisterSteps.motherDetails);
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
    }
  };

  const showSuccessMessage = useCallback(
    () =>
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
                text={
                  hasConsent?.numberOfChildren! > 0
                    ? `Great job ${user?.firstName}, you've registered ${hasConsent?.numberOfChildren} children this month.`
                    : `Great job ${user?.firstName}, you've registered 1 child this month.`
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
                    history.push(ROUTES.DASHBOARD);
                    onClose();
                  }}
                />
              </div>
            </Card>
          );
        },
      }),
    [dialog, hasConsent?.numberOfChildren, history, user?.firstName]
  );

  useEffect(() => {
    if (activeStep === InfantRegisterSteps.motherDetails && isAlreadyClient) {
      setLabel('step 4 of 4');
    }

    if (activeStep === InfantRegisterSteps.motherDetails && !isAlreadyClient) {
      setLabel('step 4 of 6');
    }
  }, [activeStep, isAlreadyClient]);

  useEffect(() => {
    if (!isLoading && wasLoading) {
      showSuccessMessage();
      if (!isRejected && healthCareWorker) {
        (async () =>
          await appDispatch(
            caregiverThunkActions.getCaregiversForHealthCareWorker({
              id: healthCareWorker?.id!,
            })
          ).unwrap())();
      }
    }
  }, [
    appDispatch,
    healthCareWorker,
    isLoading,
    isRejected,
    showSuccessMessage,
    wasLoading,
  ]);

  return (
    <div className="text-textMid">
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={'Child registration'}
        subTitle={label}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      ></BannerWrapper>
      <div
        className={'flex flex-col overflow-auto px-4 pb-5'}
        style={{ height: height - BANNER_HEIGHT }}
      >
        {steps(activeStep as InfantRegisterSteps)}
      </div>
    </div>
  );
};
