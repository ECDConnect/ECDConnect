import { Button, CheckboxGroup, Typography } from '@ecdlink/ui';
import { set } from 'date-fns';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface CertificateStepProps {
  onNext?: () => void;
  setValue: UseFormSetValue<any>;
  onSubmit?: (data: { certificatesAdded: string[] }) => void;
  initialCertificates?: string[];
}

export const CertificateStep: React.FC<CertificateStepProps> = ({
  onNext,
  setValue,
  onSubmit,
  initialCertificates = [],
}) => {
  const [certificatesAdded, setCertificatesAdded] =
    useState<string[]>(initialCertificates);
  const handleNextAction = () => {
    setValue('certificates', certificatesAdded);
    if (onNext) onNext();
    if (onSubmit) onSubmit({ certificatesAdded });
  };

  const optionList = [
    {
      id: '1',
      title: 'Bronze',
      checked: false,
      disabled: false,
    },
    {
      id: '2',
      title: 'Silver',
      checked: false,
      disabled: false,
    },
    {
      id: '3',
      title: 'Gold',
      checked: false,
      disabled: false,
    },
    {
      id: '4',
      title: 'None',
      checked: false,
      disabled: false,
    },
  ];

  function updateArray(checkbox: any, id: string) {
    if (checkbox.checked) {
      if (id === 'None') {
        setCertificatesAdded(['None']);
        return;
      }
      setCertificatesAdded([
        ...(certificatesAdded?.filter((item) => item !== 'None') ?? []),
        id,
      ]);
    } else {
      const filteredCertificates = certificatesAdded?.filter(
        (item) => item !== id
      );
      setCertificatesAdded(filteredCertificates);
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-white p-4">
      <Typography
        type={'h1'}
        text={`Certificate information`}
        className={'text-sm font-bold'}
        color={'textDark'}
      />
      <div className="flex flex-col gap-2 py-4">
        <Typography
          type="h4"
          text={
            onSubmit
              ? `Which certificates have you received?`
              : `Have you received any of these certificates?`
          }
        />
        {optionList.map((item, index) => (
          <CheckboxGroup
            checkboxColor="primary"
            id={item.id}
            key={item.id}
            title={item.title}
            checked={certificatesAdded?.some((option) => option === item.title)}
            disabled={
              certificatesAdded?.includes('None') ? item?.disabled : false
            }
            value={item.title}
            onChange={(event) => {
              updateArray(event, item?.title!);
            }}
          />
        ))}
      </div>

      <Button
        size="normal"
        className="mt-auto w-full"
        type="filled"
        color="quatenary"
        text={onSubmit ? 'Save' : 'Next'}
        textColor="white"
        icon="ArrowCircleRightIcon"
        onClick={handleNextAction}
      />
    </div>
  );
};
