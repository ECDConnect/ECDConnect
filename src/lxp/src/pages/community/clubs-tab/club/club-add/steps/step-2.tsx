import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Dropdown,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ClubAddProps, Member } from '..';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { useParams } from 'react-router';
import { ClubsRouteState } from '../../../index.types';

interface Step2Props extends ClubAddProps {
  title: string;
  hasSelectedPractitioners: boolean;
}

export const Step2 = ({
  title,
  hasSelectedPractitioners,
  step1,
  setIsEnabledButton,
  setStep2,
}: Step2Props) => {
  const [
    isToMoveSmartStartersFromOtherClub,
    setIsToMoveSmartStartersFromOtherClub,
  ] = useState<boolean>();
  const [smartStartersCount, setSmartStartersCount] = useState<number>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checkboxValue, setCheckboxValue] = useState<boolean>(false);

  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const clubs = useSelector(clubSelectors.getAllClubsForCoachSelector);

  const leadersAndNextLeaders = clubs?.map((item) => ({
    ...item.currentClubLeader,
    ...item.newClubLeader,
  }));

  const otherClubs = clubs?.filter((item) => item?.id !== club?.id);
  const mergedMembers = otherClubs
    ?.map((club) => club.clubMembers)
    .flat()
    .map((item) => item?.practitioner);

  // filteredMembers contains the members from mergedMembers that are not in leadersAndNextLeaders
  const filteredMembers = mergedMembers?.filter((member) => {
    const memberId = member?.user?.id;

    return !leadersAndNextLeaders?.some(
      (leader) => leader?.practitioner?.user?.id === memberId
    );
  });

  const availableMembers = filteredMembers?.filter(
    (member) => !selectedIds.includes(member?.id ?? '')
  );

  const isToShowDropdown =
    smartStartersCount &&
    mergedMembers &&
    smartStartersCount <= mergedMembers?.length &&
    smartStartersCount <= 18;

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const updateButtonEnabledState = useCallback(() => {
    if (isToMoveSmartStartersFromOtherClub === undefined) {
      return setIsEnabledButton(false);
    }

    if (isToMoveSmartStartersFromOtherClub) {
      return setIsEnabledButton(
        selectedIds.length === smartStartersCount && checkboxValue
      );
    }

    return setIsEnabledButton(hasSelectedPractitioners);
  }, [
    checkboxValue,
    hasSelectedPractitioners,
    isToMoveSmartStartersFromOtherClub,
    selectedIds.length,
    setIsEnabledButton,
    smartStartersCount,
  ]);

  const onChangeInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedIds([]);
    setSmartStartersCount(
      event.target.value ? Number(event.target.value) : undefined
    );
  };

  const onChange = (selectedValue: string, index: number) => {
    const newValues = [...selectedIds];
    newValues[index] = selectedValue;
    setStep2?.(
      (mergedMembers?.filter((member) =>
        newValues.includes(member?.id ?? '')
      ) as Member[]) ?? []
    );
    setSelectedIds(newValues);
  };

  useEffect(() => {
    updateButtonEnabledState();
  }, [updateButtonEnabledState]);

  return (
    <>
      <Typography type="h2" text={title} />
      <Typography
        className="mt-4 mb-2"
        type="h4"
        text={`Would you like to move any SmartStarters from a different club into the ${
          step1?.clubName || club?.name
        } club?`}
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        onOptionSelected={(value) =>
          setIsToMoveSmartStartersFromOtherClub(value as boolean)
        }
        className="mb-4"
      />
      {isToMoveSmartStartersFromOtherClub === false &&
        !hasSelectedPractitioners && (
          <Alert
            type="warning"
            title="You must select at least 1 SmartStarter to continue!"
            list={[
              'Go back to step 1 to choose SmartStarters or select Yes above.',
            ]}
          />
        )}
      {isToMoveSmartStartersFromOtherClub && (
        <>
          <FormInput
            type="number"
            label={`How many SmartStarters would you like to move from a different club into the ${step1?.clubName} club?`}
            placeholder="Add a number..."
            value={smartStartersCount}
            onChange={onChangeInput}
            {...(smartStartersCount &&
              smartStartersCount > 18 && {
                error: {
                  message:
                    'Please enter a number greater than 0 and less than 18.',
                  type: '',
                },
              })}
            {...(smartStartersCount &&
              mergedMembers &&
              smartStartersCount > mergedMembers?.length && {
                error: {
                  message: `there are only ${mergedMembers.length} available practitioners`,
                  type: '',
                },
              })}
          />

          {isToShowDropdown && (
            <>
              <Typography
                className="mt-4"
                type="h4"
                text={`Choose ${smartStartersCount} SmartStarters:`}
              />
              {Array.from(Array(smartStartersCount)).map((_, index) => {
                const selectedMember = mergedMembers?.find(
                  (item) => item?.id === selectedIds[index]
                );
                return (
                  <Dropdown<string>
                    placeholder={
                      selectedMember
                        ? `${selectedMember?.user?.firstName} ${selectedMember?.user?.surname}`
                        : 'Tap to choose SmartStarter'
                    }
                    selectedValue={selectedIds[index]}
                    list={
                      availableMembers?.map((item) => ({
                        label: `${item?.user?.firstName} ${item?.user?.surname}`,
                        value: item?.id,
                      })) ?? []
                    }
                    onChange={(id) => onChange(id, index)}
                  />
                );
              })}
              <Checkbox
                className="my-4"
                descriptionColor="textDark"
                description="I confirm that all SmartStarters selected have agreed to move to a new club."
                checked={checkboxValue}
                onCheckboxChange={(event) => setCheckboxValue(event.checked)}
              />
            </>
          )}
        </>
      )}
    </>
  );
};
