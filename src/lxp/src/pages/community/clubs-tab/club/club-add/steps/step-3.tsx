import { Alert, Dropdown, Typography } from '@ecdlink/ui';
import { ClubAddProps } from '..';
import { useEffect, useState } from 'react';

export const Step3 = ({
  setIsEnabledButton,
  step1,
  step2,
  setStep3,
}: ClubAddProps) => {
  const [selectedId, setSelectedId] = useState('');
  const availableMembers = [...(step1?.members ?? []), ...(step2 || [])];

  const onChange = (practitionerId?: string) => {
    setStep3?.({ leaderId: practitionerId });
    setSelectedId(practitionerId ?? '');
    setIsEnabledButton(!!practitionerId);
  };

  useEffect(() => {
    setIsEnabledButton(false);
  }, [setIsEnabledButton]);

  return (
    <>
      <Typography type="h2" text="Add a club" />
      <Dropdown<string | undefined>
        label="Choose a club leader:"
        placeholder="Tap to choose..."
        list={
          availableMembers?.map((member) => ({
            label: `${member?.user?.firstName} ${member?.user?.surname}`,
            value: member?.id,
          })) ?? []
        }
        selectedValue={selectedId}
        onChange={onChange}
        className="my-4"
      />
      <Alert
        type="info"
        title="All club members will be notified immediately."
      />
    </>
  );
};
