import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTenant } from '@/hooks/useTenant';
import { ProvinceDto, useTheme } from '@ecdlink/core';
import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Card,
  Dropdown,
  FormInput,
  SearchDropDownOption,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as JoinCommunity } from '@/assets/joinCommunity.svg';
import { yesOrNoOptions } from '../../community-welcome.types';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { useEffect, useState } from 'react';
import { staticDataSelectors } from '@/store/static-data';
import { useAppDispatch } from '@/store';

interface Step1Props {
  setStep: (item: number) => void;
  setValue: UseFormSetValue<any>;
  shareContactInfo: boolean | undefined;
  step: number;
  onAllStepsComplete: (item: boolean) => void;
  shareProvince: boolean | undefined;
  shareProfilePhoto?: boolean | undefined;
  provinceId: string | undefined;
  aboutShort: string | undefined;
  errors: FieldErrors;
  setJoinCommunity?: (item: boolean) => void;
  isLoading: boolean;
}

export const Step2: React.FC<Step1Props> = ({
  setStep,
  setValue,
  shareContactInfo,
  step,
  onAllStepsComplete,
  shareProvince,
  shareProfilePhoto,
  provinceId,
  aboutShort,
  setJoinCommunity,
  isLoading,
}) => {
  const dispatch = useAppDispatch();
  const tenant = useTenant();
  const appName = tenant?.tenant?.applicationName;
  const { theme } = useTheme();
  const { isOnline } = useOnlineStatus();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const provincesData = useSelector(staticDataSelectors.getProvinces);
  const [provinces, setProvinces] = useState<SearchDropDownOption<string>[]>(
    []
  );

  const mandatoryProvince = shareProvince && !provinceId ? true : false;

  const disableButton =
    shareProvince === undefined || shareProfilePhoto === undefined;

  useEffect(() => {
    if (provincesData?.length > 0) {
      const provincesSorted = provincesData
        ?.slice()
        ?.sort((a: ProvinceDto, b: ProvinceDto) =>
          a.description < b.description
            ? -1
            : a.description > b.description
            ? 1
            : 0
        );

      setProvinces(
        provincesSorted
          ?.filter((prov: ProvinceDto) => prov?.description !== 'N/A')
          ?.map((item: ProvinceDto) => {
            return {
              value: item?.id as string,
              label: item?.description,
              id: item?.id,
            };
          })
      );
    }
  }, [provincesData]);

  return (
    <div className={'h-screen overflow-auto px-4'}>
      <div className="mb-12 h-screen overflow-auto pt-2">
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
            value={aboutShort}
            onChange={(event) => setValue('aboutShort', event.target.value)}
            maxCharacters={125}
            maxLength={125}
            type="text"
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
            notSelectedColor="secondaryAccent2"
            textColor="secondary"
          />
          <Typography
            type={'h4'}
            text={`Would you like to share your province with other ${appName} users?`}
            className={'text-sm font-normal'}
            color={'textDark'}
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={yesOrNoOptions}
            onOptionSelected={(option: boolean | boolean[]) => {
              setValue('shareProvince', option);
              setValue('provinceId', '');
            }}
            notSelectedColor="secondaryAccent2"
            textColor="secondary"
          />
          {shareProvince && (
            <Dropdown
              placeholder={'Tap to choose province'}
              className={'justify-between'}
              label={'Which province are you in?'}
              selectedValue={provinceId}
              list={provinces}
              onChange={(item) => setValue('provinceId', item)}
              fullWidth
              labelColor="textMid"
              fillColor="adminBackground"
              fillType="filled"
            />
          )}
        </div>
        <div className="mb-32 mt-12 flex max-h-20 w-full flex-col gap-3">
          <Button
            size="normal"
            className="w-full"
            type="filled"
            color="quatenary"
            text="Save"
            textColor="white"
            icon="SaveIcon"
            isLoading={isLoading}
            disabled={disableButton || isLoading || mandatoryProvince}
            onClick={() => onAllStepsComplete(false)}
          />
          <Button
            size="normal"
            className="w-full"
            type="outlined"
            color="quatenary"
            text="Do this later"
            textColor="quatenary"
            icon="ClockIcon"
            onClick={() => onAllStepsComplete(true)}
          />
        </div>
      </div>
    </div>
  );
};
