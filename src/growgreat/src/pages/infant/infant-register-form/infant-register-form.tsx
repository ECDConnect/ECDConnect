import { BannerWrapper, Card, Typography, Button } from '@ecdlink/ui';
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
  CaregiverDto,
  InfantDto,
  SiteAddressDto,
} from '@/../../../packages/core/lib';
import { EditConsentAgreementProps } from '../components/consent-agrement/consent-agreement.types';
import { infantActions, infantThunkActions } from '@/store/infant';
import momImage from '../../../assets/momImage.png';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';
import { caregiverActions, caregiverThunkActions } from '@/store/caregiver';
import { MotherDetailsProps } from '../components/mother-details/mother-details.types';
import { AddressInfo } from 'net';
import { InfantAddressProps } from '../components/infant-address/infant-address.types';

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
  const [registeredClientVisible, setRegisteredClientVisible] = useState(false);
  console.log({ numberOfChildren });
  console.log(
    hasConsent,
    details,
    contactInformation,
    address,
    infantDetails,
    infantRoadToHealthBook
  );
  useEffect(() => {
    setLabel('step 1 of 6');
  }, []);

  // const { data } = useQuery(GenderList, { fetchPolicy: 'cache-and-network' });
  // console.log({ data });

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
  console.log({ multipleChildrenArray });

  const handleExistingUser = () => {
    if (isAlreadyClient) {
      completeAllSteps();
      history.push(ROUTES.DASHBOARD);
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
        const userId = newGuid();
        const caregiverId = newGuid();
        const siteAddressId = newGuid();
        const siteAddress: SiteAddressDto = {
          id: siteAddressId,
          addressLine1: address ?? '',
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
          relationId: details?.relationshipId,
        };
        const infantInputModel: InfantDto = {
          dateOfBirth: child?.dateOfBirth?.toISOString(),
          firstName: child?.firstName,
          documents: child?.roadToHealthBook,
          userId: userId ?? '',
          weightAtBirth: (child?.weightAtBirth && +child?.weightAtBirth) ?? 0,
          lengthAtBirth: (child?.lengthAtBirth && +child?.lengthAtBirth) ?? 0,
          genderId: child?.genderId ?? '',
          caregiverId: details?.id,
          caregiver: caregiverInput,
        };

        console.log({ caregiverInput });
        console.log({ infantInputModel });

        // appDispatch(caregiverActions.resetCaregiverState());
        appDispatch(caregiverActions.createCaregiver(caregiverInput));
        // appDispatch(
        //   caregiverThunkActions.createCaregiver({ caregiver: caregiverInput })
        // ).unwrap();
        appDispatch(infantActions.addInfant(infantInputModel));
        appDispatch(
          infantThunkActions.addInfant({ infant: infantInputModel })
        ).unwrap();
      }
    } else {
      const userId = newGuid();
      const caregiverId = newGuid();
      const siteAddressId = newGuid();
      const siteAddress: SiteAddressDto = {
        id: siteAddressId,
        addressLine1: address ?? '',
      };
      const caregiverInput: CaregiverDto = {
        id: caregiverId,
        firstName: details?.name ?? '',
        surname: details?.surname ?? '',
        phoneNumber: contactInformation?.cellphone ?? '',
        whatsAppNumber: contactInformation?.whatsapp,
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
        userId: userId ?? '',
        weightAtBirth:
          (infantRoadToHealthBook?.weightAtBirth &&
            +infantRoadToHealthBook?.weightAtBirth) ??
          0,
        lengthAtBirth:
          (infantRoadToHealthBook?.lengthAtBirth &&
            +infantRoadToHealthBook?.lengthAtBirth) ??
          0,
        caregiverId: details?.id,
        caregiver: caregiverInput,
      };

      console.log({ caregiverInput });
      console.log({ infantInputModel });

      appDispatch(caregiverActions.createCaregiver(caregiverInput));
      appDispatch(infantActions.addInfant(infantInputModel));
      appDispatch(
        infantThunkActions.addInfant({ infant: infantInputModel })
      ).unwrap();
    }
  };

  const steps = (step: InfantRegisterSteps) => {
    switch (step) {
      case InfantRegisterSteps.consentAgreement:
      default:
        return (
          <div className="text-textMid">
            <ConsentAgreement
              multipleChildren={multipleChildren}
              setMultipleChildren={setMultipleChildren}
              onSubmit={(value) => {
                setActiveStep(InfantRegisterSteps.infantDetails);
                setHasConsent(value as any);
                setLabel(`step 2 of 5`);
              }}
            />
          </div>
        );
      case InfantRegisterSteps.infantDetails:
        return (
          <div className="text-textMid">
            <InfantDetails
              multipleChildrenCount={multipleChildrenCount}
              numberOfChildren={numberOfChildren}
              onSubmit={(value) => {
                setLabel(`step 3 of 5`);
                setInfantDetails(value);
                setActiveStep(InfantRegisterSteps.infantRoadToHealth);
              }}
            />
          </div>
        );
      case InfantRegisterSteps.infantRoadToHealth:
        return (
          <div className="text-textMid">
            <InfantRoadToHealth
              onSubmit={(value) => {
                setLabel(`step 4 of 5`);
                handleMultipleChildrenSteps();
                // setActiveStep(InfantRegisterSteps.motherDetails);
                setInfantRoadToHealthBook(value);
              }}
            />
          </div>
        );
      case InfantRegisterSteps.motherDetails:
        return (
          <div className="text-textMid">
            <MotherDetails
              setMultipleChildrenArray={setMultipleChildrenArray}
              multipleChildrenArray={multipleChildrenArray}
              infantDetails={infantDetails}
              setContactInformation={setContactInformation}
              setAddress={setAddress}
              setIsAlreadyClient={setIsAlreadyClient}
              isAlreadyClient={isAlreadyClient}
              onSubmit={(value) => {
                setLabel(`step 3 of 5`);
                setDetails(value as any);
                handleExistingUser();
              }}
            />
          </div>
        );
      case InfantRegisterSteps.pregnantContactInformation:
        return (
          <div className="text-textMid">
            <MotherContactInformation
              details={details}
              onSubmit={(value) => {
                setLabel(`step 4 of 5`);
                setActiveStep(InfantRegisterSteps.pregnantAddress);
                setContactInformation(value);
              }}
            />
          </div>
        );
      case InfantRegisterSteps.pregnantAddress:
        return (
          <div className="text-textMid">
            <InfantAddress
              details={details}
              onSubmit={(value) => {
                setLabel(`step 5 of 5`);
                // setActiveStep(InfantRegisterSteps.pregnantMaternalRecord);
                setAddress(value.address);
                completeAllSteps();
                // history.push(ROUTES.DASHBOARD);
                setRegisteredClientVisible(true);
              }}
            />
          </div>
        );
    }
  };

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
      {registeredClientVisible ? (
        <div className="h-full w-full flex justify-center items-center mt-40">
          <Card
            borderRaduis={'md'}
            shadowSize={'lg'}
            className="flex flex-col justify-scenter items-center p-4 w-11/12"
          >
            <div className="h-28 w-28 rounded-full bg-tertiary justify-center items-center flex">
              <img className={'m-auto'} src={momImage} alt="card" />
            </div>
            <div>
              <Typography
                className="mt-6"
                text={'New client registered!'}
                type="h3"
                weight="bold"
                lineHeight="snug"
              />
            </div>
            <div>
              <Typography
                className="mt-4"
                text={`Great job ${user?.firstName}, you've registered 1 children this month.`}
                type="body"
                lineHeight="snug"
              />
            </div>
            <div className={'mt-4 w-full flex justify-center'}>
              <Button
                type={'filled'}
                color={'primary'}
                className={'w-11/12 max-h-10'}
                textColor={'white'}
                text={`Close`}
                icon={'XIcon'}
                iconPosition={'start'}
                onClick={() => history.push(ROUTES.DASHBOARD)}
              />
            </div>
          </Card>
        </div>
      ) : (
        <div className={'px-4 pb-5'}>
          {steps(activeStep as InfantRegisterSteps)}
        </div>
      )}
    </div>
  );
};
