import { useTenant } from '@/hooks/useTenant';
import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Card,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as JoinCommunity } from '@/assets/joinCommunity.svg';
import { yesOrNoOptions } from '../../community-welcome.types';
import { UseFormSetValue } from 'react-hook-form';
import { useAppDispatch } from '@/store';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { useSelector } from 'react-redux';
import { useState } from 'react';

interface Step1Props {
  setStep: (item: number) => void;
  setValue: UseFormSetValue<any>;
  shareContactInfo: boolean | undefined;
  step: number;
  setJoinCommunity: (item: boolean) => void;
  seNotJoining: (item: boolean) => void;
}

export const Step1: React.FC<Step1Props> = ({
  setStep,
  setValue,
  shareContactInfo,
  step,
  setJoinCommunity,
  seNotJoining,
}) => {
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const [isLoading, setIsLoading] = useState(false);

  const handleNextAction = async () => {
    if (shareContactInfo === true) {
      setStep(step + 1);
      return;
    } else {
      setIsLoading(true);
      seNotJoining(true);
      setIsLoading(false);

      await dispatch(
        practitionerThunkActions.updatePractitionerCommunityTabStatus({
          practitionerUserId: practitioner?.userId!,
        })
      );
      handleSetJoinCommunity();
    }
  };

  const handleSetJoinCommunity = () => {
    setJoinCommunity(false);
  };

  return (
    <div className={'h-screen overflow-auto px-4'}>
      <div className="h-screen overflow-auto pt-2">
        <div className="flex flex-col gap-11">
          <div className="flex w-full justify-center">
            <Card
              className="bg-uiBg fixed flex w-11/12 flex-col items-center gap-3 p-6"
              borderRaduis="xl"
              shadowSize="lg"
            >
              <div className="">
                <JoinCommunity />
              </div>
              <Typography
                color="textDark"
                text={`Join your ${appName} community!`}
                type={'h3'}
                align="center"
              />
            </Card>
          </div>
        </div>
        <div className="mt-56 py-4">
          <Typography
            type={'h4'}
            text={`Would you like to share your information with other ECD Heroes and join the ${appName} community?`}
            className={'text-sm font-normal'}
            color={'textDark'}
          />
          <Typography
            type={'help'}
            text={'You can choose which information is shared.'}
            className={'mb-2 text-sm font-normal'}
            color={'textMid'}
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={yesOrNoOptions}
            onOptionSelected={(option: boolean | boolean[]) => {
              setValue('shareContactInfo', option);
            }}
            selectedOptions={shareContactInfo}
            notSelectedColor="secondaryAccent2"
            textColor="secondary"
          />
        </div>
        <div className="mt-32 mb-20 max-h-20 w-full p-4 align-bottom">
          <Button
            size="normal"
            className="w-full"
            type="filled"
            color="quatenary"
            text="Next"
            textColor="white"
            icon="ArrowCircleRightIcon"
            isLoading={isLoading}
            disabled={shareContactInfo === undefined || isLoading}
            onClick={handleNextAction}
          />
        </div>
      </div>
    </div>
  );
};
