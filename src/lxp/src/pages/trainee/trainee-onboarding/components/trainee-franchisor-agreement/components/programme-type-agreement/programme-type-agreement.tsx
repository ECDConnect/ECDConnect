import Article from '@/components/article/article';
import { practitionerSelectors } from '@/store/practitioner';
import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Dialog,
  DialogPosition,
  Typography,
} from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ProgrammeTypeDto } from '@ecdlink/core';
import { Controller } from 'react-hook-form';
import { staticDataSelectors } from '@/store/static-data';
import { ModelInfo } from './components/model-info';
import { ProgrammeTypeTexts } from './components/modelTexts';
import { authSelectors } from '@/store/auth';
import { TraineeService } from '@/services/TraineeService';
import { UserConsentInput } from '@ecdlink/graphql';
import { contentConsentSelectors } from '@/store/content/consent';
import { newGuid } from '@/utils/common/uuid.utils';

interface ProgrammeTypeAgreementProps {
  setAgreementStep: any;
  setNotificationStep: any;
}

export const ProgrammeTypeAgreement: React.FC<ProgrammeTypeAgreementProps> = ({
  setAgreementStep,
  setNotificationStep,
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [openModelInfo, setOpenModelInfo] = useState<boolean>(false);
  const programData = useSelector(staticDataSelectors.getProgrammeTypes);
  const [modelType, setModelType] = useState('');
  const [programmeType, setProgrammeType] = useState('');
  const consentList = useSelector(contentConsentSelectors.getConsent);
  const franchisorAgreement = consentList?.find(
    (item) => item.type === 'FranchiseeAgreement'
  );

  const handleSetInfoModelPage = (model: string) => {
    setOpenModelInfo(true);
    setModelType(model);
  };

  const handleUpdateConsent = async () => {
    if (franchisorAgreement) {
      const agreementInput: UserConsentInput = {
        ConsentId: franchisorAgreement?.id,
        ConsentType: 'FranchiseeAgreement',
        CreatedUserId: practitioner?.userId,
        Id: newGuid(),
        IsActive: true,
        // UpdatedBy: '',
        UserId: practitioner?.userId,
      };

      await new TraineeService(userAuth?.auth_token!).signFranchisorAgreement(
        agreementInput?.Id,
        agreementInput
      );
    }

    setNotificationStep('');
  };

  const renderInfoPage = (page: string) => {
    switch (page) {
      case 'a':
        return (
          <ModelInfo
            setOpenModelInfo={setOpenModelInfo}
            modelTypeObject={ProgrammeTypeTexts?.ModelA}
          />
        );
      case 'b':
        return (
          <ModelInfo
            setOpenModelInfo={setOpenModelInfo}
            modelTypeObject={ProgrammeTypeTexts?.ModelB}
          />
        );
      case 'c':
        return (
          <ModelInfo
            setOpenModelInfo={setOpenModelInfo}
            modelTypeObject={ProgrammeTypeTexts?.ModelC}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col justify-around p-4">
        <div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'Programme type agreement'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={'See information about each model:'}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className={'mt-1 mb-3 w-min'}
            type="outlined"
            color="primary"
            background={'transparent'}
            size="small"
            onClick={() => handleSetInfoModelPage('a')}
            icon="ArrowNarrowRightIcon"
            iconPosition="start"
          >
            <Typography
              type="buttonSmall"
              color="primary"
              text={'Model A - Playgroups'}
              className="whitespace-nowrap"
            ></Typography>
          </Button>
          <Button
            className={'mt-1 mb-3 w-min'}
            type="outlined"
            color="primary"
            background={'transparent'}
            size="small"
            onClick={() => handleSetInfoModelPage('b')}
            icon="ArrowNarrowRightIcon"
            iconPosition="start"
          >
            <Typography
              type="buttonSmall"
              color="primary"
              text={'Model B - Day mothers'}
              className="whitespace-nowrap"
            ></Typography>
          </Button>
          <Button
            className={'mt-1 mb-3 w-min'}
            type="outlined"
            color="primary"
            background={'transparent'}
            size="small"
            onClick={() => handleSetInfoModelPage('c')}
            icon="ArrowNarrowRightIcon"
            iconPosition="start"
          >
            <Typography
              type="buttonSmall"
              color="primary"
              text={'Model C - Preschools / ECD centres'}
              className="whitespace-nowrap"
            ></Typography>
          </Button>
        </div>
        <div className={'w-full'}>
          <label
            className={
              'font-body text-textMid mb-2 block text-base font-semibold leading-snug'
            }
          >
            What type of programme are you running or planning to run?
          </label>
          <div className="mt-1">
            <ButtonGroup<string>
              options={
                (programData &&
                  programData.map((x: ProgrammeTypeDto) => {
                    return { text: x?.description, value: x.id ?? '' };
                  })) ||
                []
              }
              onOptionSelected={(value) => setProgrammeType(value as string)}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full'}
            />
          </div>
        </div>
        <div className="mt-4 -mb-4 h-full w-full self-end">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="primary"
            text="Save"
            textColor="white"
            icon="SaveIcon"
            onClick={handleUpdateConsent}
            disabled={!programmeType}
          />
        </div>
      </div>
      <Dialog
        visible={openModelInfo}
        stretch={true}
        position={DialogPosition.Full}
      >
        <div>{renderInfoPage(modelType)}</div>
      </Dialog>
    </>
  );
};
