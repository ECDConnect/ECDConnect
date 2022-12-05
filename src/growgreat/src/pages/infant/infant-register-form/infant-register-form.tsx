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
import { useEffect, useState } from 'react';
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
  // caregiverThunkActions
} from '@/store/caregiver';
import { MotherDetailsProps } from '../components/mother-details/mother-details.types';
// import { AddressInfo } from 'net';
// import { InfantAddressProps } from '../components/infant-address/infant-address.types';
import { useStaticData } from '@/hooks/useStaticData';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { documentActions, documentThunkActions } from '@/store/document';
import { useWindowSize } from '@reach/window-size';

const BANNER_HEIGHT = 64;

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

  const handleExistingUser = () => {
    if (isAlreadyClient) {
      completeAllSteps();
      showSuccessMessage();
      return;
    }
    setActiveStep(InfantRegisterSteps.pregnantContactInformation);
  };

  const handleMultipleChildrenSteps = () => {
    if (multipleChildrenCount < Number(numberOfChildren!)) {
      setActiveStep(InfantRegisterSteps.infantDetails);
      setMultipleChildrenCount(multipleChildrenCount + 1);
      return;
    }
    setActiveStep(InfantRegisterSteps.motherDetails);
  };

  const completeAllSteps = () => {
    if (multipleChildrenArray.length >= 1) {
      for (const child of multipleChildrenArray) {
        let weightAtBirth = undefined;
        let lengthAtBirth = undefined;
        if (child?.roadToHealthBook) {
          weightAtBirth = (child?.weightAtBirth && +child?.weightAtBirth) ?? 0;
          lengthAtBirth = (child?.lengthAtBirth && +child?.lengthAtBirth) ?? 0;
        }

        const childUserId = newGuid();
        const caregiverId = newGuid();
        const siteAddressId = newGuid();
        const siteAddress: SiteAddressDto = {
          id: siteAddressId,
          addressLine1: address ?? '',
        };
        const userInput: UserDto = {
          phoneNumber: contactInformation?.cellphone ?? '',
          firstName: details?.name ?? '',
          surname: details?.surname ?? '',
          dateOfBirth: infantDetails?.dateOfBirth?.toISOString(),
        };
        const caregiverInput: CaregiverDto = {
          id: caregiverId,
          firstName: details?.name ?? '',
          surname: details?.surname ?? '',
          phoneNumber: contactInformation?.cellphone ?? '',
          whatsAppNumber:
            contactInformation?.whatsapp ?? contactInformation?.cellphone,
          age: details?.age,
          siteAddress: siteAddress,
          isActive: true,
          healthCareWorkerId: user?.id,
          relationId: details?.relationshipId, // TODO we need to get the relation ids here // child?.relationship ?? '',
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
          caregiverId: details?.id,
          caregiver: caregiverInput,
        };
        appDispatch(caregiverActions.createCaregiver(caregiverInput));
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
      const caregiverId = newGuid();
      const siteAddressId = newGuid();
      const siteAddress: SiteAddressDto = {
        id: siteAddressId,
        addressLine1: address ?? '',
      };
      const user: UserDto = {
        phoneNumber: contactInformation?.cellphone ?? '',
        firstName: details?.name ?? '',
        surname: details?.surname ?? '',
        dateOfBirth: infantDetails?.dateOfBirth?.toISOString(),
      };
      const caregiverInput: CaregiverDto = {
        id: caregiverId,
        firstName: details?.name ?? '',
        surname: details?.surname ?? '',
        phoneNumber: contactInformation?.cellphone ?? '',
        whatsAppNumber: contactInformation?.whatsapp,
        healthCareWorkerId: user?.id,
        age: details?.age,
        isActive: true,
        siteAddress: siteAddress,
        relationId: details?.relationshipId,
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
        caregiverId: details?.id,
        caregiver: caregiverInput,
      };
      appDispatch(caregiverActions.createCaregiver(caregiverInput));
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
              setLabel(`step 4 of 6`);
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
              handleExistingUser();

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
              completeAllSteps();
              showSuccessMessage();
            }}
          />
        );
    }
  };

  const showSuccessMessage = () =>
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
    });

  useEffect(() => {
    if (activeStep === InfantRegisterSteps.motherDetails && isAlreadyClient) {
      setLabel('step 4 of 4');
    }

    if (activeStep === InfantRegisterSteps.motherDetails && !isAlreadyClient) {
      setLabel('step 4 of 6');
    }
  }, [activeStep, isAlreadyClient]);

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
