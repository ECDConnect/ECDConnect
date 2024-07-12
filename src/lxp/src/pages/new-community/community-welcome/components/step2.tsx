import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import { useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Card,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as JoinCommunity } from '@/assets/joinCommunity.svg';
import { ReactComponent as Cebisa } from '@/assets/icon_cebisa.svg';
import { yesOrNoOptions } from '../community-welcome.types';
import { Control, FieldValues, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

interface Step1Props {
  setStep: (item: number) => void;
  setValue: UseFormSetValue<any>;
  shareContactInfo: boolean | undefined;
  step: number;
  onAllStepsComplete: () => void;
}

export const Step2: React.FC<Step1Props> = ({
  setStep,
  setValue,
  shareContactInfo,
  step,
  onAllStepsComplete,
}) => {
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  console.log({ tenant });
  return (
    <div className={'h-screen overflow-auto px-4'}>
      <div className="h-screen overflow-auto pt-2">
        <div className="flex flex-col gap-11">
          <div className="flex w-full justify-center">
            <Card
              className="bg-uiBg fixed z-50 flex w-11/12 flex-col items-center gap-3 p-6"
              borderRaduis="xl"
              shadowSize="lg"
            >
              <div className="">
                <JoinCommunity />
              </div>
              <Typography
                color="textDark"
                text={`Welcome to the community ${practitioner?.user?.firstName}!`}
                type={'body'}
                align="center"
              />
              <Typography
                color="textMid"
                text={`Share some info about yourself. You can always change these details on your profile if you need to.`}
                type={'h4'}
                align="center"
              />
            </Card>
          </div>
        </div>
        <div className="mt-72 flex flex-col gap-3 py-4">
          <FormInput
            label={`Share something about yourself with other ${appName} practitioners!`}
            hint="Optional - you can change this at any time."
            placeholder="E.g. Love working with kids"
            //   value={value}
            onChange={(event) => setValue('aboutShort', event.target.value)}
          />
          <Typography
            type={'h4'}
            text={`Would you like to share your profile photo with other ${appName} users?`}
            className={'text-sm font-normal'}
            color={'textDark'}
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={yesOrNoOptions}
            onOptionSelected={(option: boolean | boolean[]) => {
              setValue('shareProfilePhoto', option);
            }}
            selectedOptions={shareContactInfo}
            notSelectedColor="secondaryAccent2"
            textColor="secondary"
          />
          <Typography
            type={'h4'}
            text={`Would you like to share your profile photo with other ${appName} users?`}
            className={'text-sm font-normal'}
            color={'textDark'}
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={yesOrNoOptions}
            onOptionSelected={(option: boolean | boolean[]) => {
              setValue('shareProvince', option);
            }}
            selectedOptions={shareContactInfo}
            notSelectedColor="secondaryAccent2"
            textColor="secondary"
          />
        </div>
        <div className="mb-24 mt-12 flex max-h-20 w-full flex-col gap-3">
          <Button
            size="normal"
            className="w-full"
            type="filled"
            color="quatenary"
            text="Save"
            textColor="white"
            icon="SaveIcon"
            disabled={!shareContactInfo}
            onClick={onAllStepsComplete}
          />
          <Button
            size="normal"
            className="w-full"
            type="outlined"
            color="quatenary"
            text="Do this later"
            textColor="quatenary"
            icon="ClockIcon"
            disabled={!shareContactInfo}
            onClick={onAllStepsComplete}
          />
        </div>
      </div>
    </div>
  );
};
