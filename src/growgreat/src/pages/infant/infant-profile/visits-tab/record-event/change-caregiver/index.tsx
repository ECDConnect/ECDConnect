import { InfantDto } from '@ecdlink/core';
import { BannerWrapper } from '@ecdlink/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCallback, useMemo, useState } from 'react';
import { MotherDetails } from '@/pages/infant/components/mother-details/mother-details';
import { InfantDetailsModel } from '@/schemas/infant/infant-details';
import { MotherContactInformation } from '@/pages/infant/components/mother-contact-information/mother-contact-information';
import { MothertContactInformationModel } from '@/schemas/infant/mother-contact-information';
import { InfantAddress } from '@/pages/infant/components/infant-address/infant-address';
import { useAppDispatch } from '@/store';
import { infantThunkActions } from '@/store/infant';
import { InfantModelInput } from '@/../../../packages/graphql/lib';
import { newGuid } from '@utils/common/uuid.utils';
import { MotherDetailsModel } from '@/schemas/infant/mother-details';

export const ChangeCaregiver = ({
  infant,
  goBack,
}: {
  infant?: InfantDto;
  goBack: () => void;
}) => {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [isAlreadyClient, setIsAlreadyClient] = useState();
  const [caregiverDetails, setMotherDetailsData] = useState<
    MotherDetailsModel | undefined
  >();
  const [caregiverContactInformation, setMotherContactInformationData] =
    useState<MothertContactInformationModel | undefined>();

  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const infantDetails: InfantDetailsModel = useMemo(
    () => ({
      dateOfBirth: !!infant?.dateOfBirth
        ? new Date(infant?.dateOfBirth)
        : undefined,
      firstName: infant?.user?.firstName,
      genderId: infant?.genderId,
    }),
    [infant?.dateOfBirth, infant?.genderId, infant?.user?.firstName]
  );

  const onSubmit = useCallback(
    async (input: InfantModelInput) => {
      const payload = {
        infantId: infant?.user?.id || '',
        input,
      };

      await appDispatch(
        infantThunkActions.updateInfantCaregiver(payload)
      ).unwrap();
    },
    [appDispatch, infant?.user?.id]
  );

  const handleOnSubmitMotherDetails = useCallback(
    (data: MotherDetailsModel) => {
      if (isAlreadyClient) {
        const input: InfantModelInput = {
          userId: infant?.user?.id,
          dateOfBirth: infant?.user?.dateOfBirth,
          caregiverId: data.id,
          caregiver: {
            relationId: data?.relationshipId,
            firstName: data?.name,
            surname: data?.surname,
          },
        };

        return onSubmit(input);
      }

      setMotherDetailsData(data);
      return setStep(1);
    },
    [infant?.user?.dateOfBirth, infant?.user?.id, isAlreadyClient, onSubmit]
  );

  const handleOnSubmitMotherContactInformation = useCallback((data) => {
    setMotherContactInformationData(data);
    setStep(2);
  }, []);

  const handleOnSubmitCaregiverAddress = useCallback(
    async (caregiverAddress) => {
      const newCaregiverId = newGuid();
      const input: InfantModelInput = {
        userId: infant?.user?.id,
        dateOfBirth: infant?.user?.dateOfBirth,
        caregiverId: newCaregiverId,
        caregiver: {
          relationId: caregiverDetails?.relationshipId,
          firstName: caregiverDetails?.name,
          surname: caregiverDetails?.surname,
          age: caregiverDetails?.age,
          phoneNumber: caregiverContactInformation?.cellphone,
          whatsAppNumber:
            caregiverContactInformation?.whatsapp ||
            caregiverContactInformation?.cellphone,
          siteAddress: {
            AddressLine1: caregiverAddress?.address,
            IsActive: true,
          },
        },
      };

      onSubmit(input);
    },
    [
      caregiverContactInformation?.cellphone,
      caregiverContactInformation?.whatsapp,
      caregiverDetails?.age,
      caregiverDetails?.name,
      caregiverDetails?.relationshipId,
      caregiverDetails?.surname,
      infant?.user?.dateOfBirth,
      infant?.user?.id,
      onSubmit,
    ]
  );

  const renderContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <MotherContactInformation
            details={caregiverDetails}
            onSubmit={handleOnSubmitMotherContactInformation}
          />
        );
      case 2:
        return (
          <InfantAddress
            details={caregiverDetails}
            infantDetails={infantDetails}
            onSubmit={handleOnSubmitCaregiverAddress}
          />
        );
      default:
        return (
          <MotherDetails
            infantDetails={infantDetails}
            onSubmit={handleOnSubmitMotherDetails}
            setIsAlreadyClient={setIsAlreadyClient}
            isAlreadyClient={isAlreadyClient}
          />
        );
    }
  }, [
    handleOnSubmitCaregiverAddress,
    handleOnSubmitMotherContactInformation,
    handleOnSubmitMotherDetails,
    infantDetails,
    isAlreadyClient,
    caregiverDetails,
    step,
  ]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder
      onBack={goBack}
      title={`${
        infant?.caregiver?.firstName ? infant?.caregiver?.firstName + ' & ' : ''
      }${infant?.user?.firstName || ''} `}
      subTitle={`step ${step + 1} of ${isAlreadyClient ? '1' : '3'}`}
      backgroundColour="white"
      displayOffline={!isOnline}
      className={'flex flex-col px-4 pb-4'}
    >
      {renderContent}
    </BannerWrapper>
  );
};
