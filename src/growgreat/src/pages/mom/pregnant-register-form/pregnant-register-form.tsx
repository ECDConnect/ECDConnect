import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import {
  BannerWrapper,
  Card,
  Button,
  Typography,
  DialogPosition,
} from '@ecdlink/ui';
import { FileTypeEnum, WorkflowStatusEnum } from '@ecdlink/graphql';
import {
  Document,
  MotherDto,
  SiteAddressDto,
  UserDto,
  CaregiverDto,
  useDialog,
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

const BANNER_HEIGHT = 64;

export const PregnantRegisterForm: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const history = useHistory();

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
        pregnantMaternalCaseRecord?.deliveryDate?.toISOString(),
      whatsAppNumber:
        contactInformation?.whatsapp ?? contactInformation?.cellphone,
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
    relations,
    getDocumentTypeIdByEnum,
    getWorkflowStatusIdByEnum,
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
          <ConsentAgreement
            onSubmit={(value) => {
              setActiveStep(PregnantRegisterSteps.pregnantDetails);
              setLabel(`step 2 of 5`);
            }}
          />
        );
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
              showSuccessMessage();
            }}
          />
        );
    }
  };

  useEffect(() => {
    setLabel('step 1 of 5');
  }, []);

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
              text={`Great job ${user?.firstName}, you've registered 1 pregnant mom this month.`}
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

  return (
    <div className="text-textMid">
      <BannerWrapper
        size={'normal'}
        subTitle={label}
        renderBorder={true}
        displayOffline={!isOnline}
        onBack={() => history.goBack()}
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
