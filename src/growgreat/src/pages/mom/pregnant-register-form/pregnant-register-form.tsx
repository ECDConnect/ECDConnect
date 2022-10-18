import { BannerWrapper, Card, Button, Typography } from '@ecdlink/ui';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useCallback, useEffect, useState } from 'react';
import ROUTES from '@routes/routes';
import { useAppDispatch } from '@store';
import { PregnantRegisterSteps } from './pregnant-register-form.types';
import { ConsentAgreement } from '../components/consent-agrement/consent-agreement';
import { PregnantDetails } from '../components/pregnant-details/pregnant-details';
import { ContactInformation } from '../components/contact-information/contact-information';
import { PregnantAddress } from '../components/pregnant-address/pregnant-address';
import { PregnantMaternalCaseRecord } from '../components/pregnant-maternal-record/pregnant-maternal-record';
import { newGuid } from '@utils/common/uuid.utils';
import {
  Document,
  MotherDto,
  SiteAddressDto,
  UserDto,
  CaregiverDto,
} from '@/../../../packages/core/lib';
import { EditPregnantDetailsProps } from '../components/pregnant-details/pregnant-details.types';
import { PregnantAddressProps } from '../components/pregnant-address/pregnant-address.types';
import { PregnantMaternalCaseRecordProps } from '../components/pregnant-maternal-record/pregnant-maternal-record.types';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';
import { EditPregnantContactInformationProps } from '../components/contact-information/contact-information.types';
import { motherActions, motherThunkActions } from '@/store/mother';
import momImage from '../../../assets/momImage.png';
import { documentActions, documentThunkActions } from '@/store/document';
import { useStaticData } from '@/hooks/useStaticData';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import { caregiverActions } from '@/store/caregiver';
import { staticDataSelectors } from '@/store/static-data';

export const PregnantRegisterForm: React.FC = () => {
  const [label, setLabel] = useState('');
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasConsent, setHasConsent] = useState(false);
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
  const [registeredClientVisible, setRegisteredClientVisible] = useState(false);
  const { getWorkflowStatusIdByEnum, getDocumentTypeIdByEnum } =
    useStaticData();
  const relations = useSelector(staticDataSelectors.getRelations);

  useEffect(() => {
    setLabel('step 1 of 5');
  }, []);

  const handleExistingUser = () => {
    if (isAlreadyClient) {
      setActiveStep(PregnantRegisterSteps.pregnantMaternalRecord);
      return;
    }
    setActiveStep(PregnantRegisterSteps.pregnantContactInformation);
  };

  useEffect(() => {
    if (pregnantMaternalCaseRecord?.deliveryDate !== undefined) {
      completeAllSteps();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pregnantMaternalCaseRecord?.deliveryDate]);

  const completeAllSteps = useCallback(() => {
    const motherId = newGuid();
    const motherUserId = newGuid();
    const siteAddressDto: SiteAddressDto = {
      addressLine1: address?.address ?? '',
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
      siteAddressId: address?.address ?? '',
      healthCareWorkerId: user?.id ?? '',
      age: details?.age,
      expectedDateOfDelivery:
        pregnantMaternalCaseRecord?.deliveryDate?.toISOString(),
      whatsAppNumber:
        contactInformation?.whatsapp ?? contactInformation?.cellphone,
    };
    const caregiverInput: CaregiverDto = {
      firstName: details?.name ?? '',
      surname: details?.surname ?? '',
      phoneNumber: contactInformation?.cellphone ?? '',
      whatsAppNumber: contactInformation?.whatsapp,
      age: details?.age,
      isActive: true,
      siteAddress: siteAddressDto,
      relationId: relations.find((x) => x.description == 'Mother')?.id,
    };
    appDispatch(caregiverActions.createCaregiver(caregiverInput));
    appDispatch(motherActions.addMother(motherInputModel));
    appDispatch(
      motherThunkActions.addMother({ mother: motherInputModel })
    ).unwrap();

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
  }, [
    appDispatch,
    pregnantMaternalCaseRecord,
    user,
    contactInformation,
    address,
    details,
  ]);

  const steps = (step: PregnantRegisterSteps) => {
    switch (step) {
      case PregnantRegisterSteps.consentAgreement:
      default:
        return (
          <div className="text-textMid">
            <ConsentAgreement
              onSubmit={(value) => {
                setActiveStep(PregnantRegisterSteps.pregnantDetails);
                setHasConsent(value as boolean);
                setLabel(`step 2 of 5`);
              }}
            />
          </div>
        );
      case PregnantRegisterSteps.pregnantDetails:
        return (
          <div className="text-textMid">
            <PregnantDetails
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
      case PregnantRegisterSteps.pregnantContactInformation:
        return (
          <div className="text-textMid">
            <ContactInformation
              details={details as any}
              onSubmit={(value) => {
                setLabel(`step 4 of 5`);
                setActiveStep(PregnantRegisterSteps.pregnantAddress);
                setContactInformation(value as any);
              }}
            />
          </div>
        );
      case PregnantRegisterSteps.pregnantAddress:
        return (
          <div className="text-textMid">
            <PregnantAddress
              details={details as any}
              onSubmit={(value) => {
                setLabel(`step 5 of 5`);
                setActiveStep(PregnantRegisterSteps.pregnantMaternalRecord);
                setAddress(value as any);
              }}
            />
          </div>
        );
      case PregnantRegisterSteps.pregnantMaternalRecord:
        return (
          <div className="text-textMid">
            <PregnantMaternalCaseRecord
              details={details as any}
              onSubmit={(value) => {
                setLabel(`step 5 of 5`);
                setPregnantMaternalCaseRecord(value as any);
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
        title={'Pregnant mom registration'}
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
                text={`Great job ${user?.firstName}, you've registered 1 pregnant mom this month.`}
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
          {steps(activeStep as PregnantRegisterSteps)}
        </div>
      )}
    </div>
  );
};
